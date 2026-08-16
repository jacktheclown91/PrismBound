from pathlib import Path
import re,sys,tempfile,subprocess,struct,binascii,os
try:
 import zopfli.zlib as zz
except ImportError:
 zz=None
root=Path(__file__).resolve().parents[1]
tools=Path(__file__).resolve().parent
LIMIT=13312
SRC=['data.js','world.js','battle.js','render.js','input.js','main.js']

# ---------------------------------------------------------------------------
# Release-only compression pipeline.
#
# Primary path (smallest): Terser (local-variable mangle, no property mangle so
# every DOM/Canvas/AudioContext/localStorage/key name stays intact) followed by
# Roadroller context-mixing packing. Measured winner over plain Zopfli DEFLATE for this game. Terser and
# Roadroller versions are pinned in tools/package.json and Roadroller runs with
# fixed, pre-tuned parameters for reproducible public release builds.
#
# Fallback path: the original comment/whitespace minifier + Zopfli. It is useful
# for diagnostics when the Node toolchain is absent, but may now exceed 13 KiB.
# Oversized candidates fail without replacing an existing known-good release.
#
# Release publication is transactional with respect to validation: build and size
# are proven first, then temporary outputs replace dist only on success.
# ---------------------------------------------------------------------------

# Terser invocation and Roadroller parameters are pinned for a reproducible build.
# Re-tune after a material source change: run
#   node tools/node_modules/roadroller/cli.mjs <minified.js> -O2
# and paste the printed "-Z.. -S.." replicate flags below.
TERSER_ARGS=['-c','passes=3,unsafe=true,unsafe_arrows=true,unsafe_math=true,booleans_as_integers=true','-m','--comments','false']
ROADROLLER_FLAGS=['-Zab32','-Zlr1500','-Zmd14','-Zpr16','-S0,1,2,3,6,7,13,21,42,209,337,419']

def which_node():
    for exe in ('node','node.exe'):
        try:
            subprocess.run([exe,'--version'],capture_output=True)
            return exe
        except OSError:
            continue
    return None

def minify_js(s):
    out=[];i=0;n=len(s);pending=False
    def word(c):return c.isalnum() or c in '_$'
    while i<n:
        c=s[i]
        if c in "'\"`":
            if pending and out and word(out[-1]) and word(c):out.append(' ')
            pending=False;q=c;out.append(c);i+=1
            while i<n:
                c=s[i];out.append(c);i+=1
                if c=='\\' and i<n:out.append(s[i]);i+=1;continue
                if c==q:break
            continue
        if c=='/' and i+1<n and s[i+1]=='/':
            i+=2
            while i<n and s[i] not in '\r\n':i+=1
            pending=True;continue
        if c=='/' and i+1<n and s[i+1]=='*':
            j=s.find('*/',i+2);i=n if j<0 else j+2;pending=True;continue
        if c.isspace():pending=True;i+=1;continue
        if pending and out:
            a=out[-1]
            if word(a) and word(c) or a+c in ('++','--','//','/*'):out.append(' ')
        pending=False;out.append(c);i+=1
    return ''.join(out)

def run_terser(node,concat):
    bin=tools/'node_modules'/'terser'/'bin'/'terser'
    if not bin.exists():return None
    with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8') as f:
        f.write(concat);inp=f.name
    outp=inp+'.min.js'
    try:
        q=subprocess.run([node,str(bin),inp,*TERSER_ARGS,'-o',outp],capture_output=True,text=True)
        if q.returncode or not Path(outp).exists():
            sys.stderr.write(q.stderr or 'terser failed\n');return None
        return Path(outp).read_text(encoding='utf-8')
    finally:
        for p in (inp,outp):Path(p).unlink(missing_ok=True)

def run_roadroller(node,mini):
    bin=tools/'node_modules'/'roadroller'/'cli.mjs'
    if not bin.exists():return None
    with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8') as f:
        f.write(mini);inp=f.name
    outp=inp+'.rr.js'
    try:
        q=subprocess.run([node,str(bin),inp,*ROADROLLER_FLAGS,'-o',outp],capture_output=True,text=True)
        if q.returncode or not Path(outp).exists():
            sys.stderr.write(q.stderr or 'roadroller failed\n');return None
        return Path(outp).read_text(encoding='utf-8')
    finally:
        for p in (inp,outp):Path(p).unlink(missing_ok=True)

def node_check(node,js):
    with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8') as f:
        f.write(js);tmp=f.name
    q=subprocess.run([node,'--check',tmp],capture_output=True,text=True)
    Path(tmp).unlink(missing_ok=True)
    return q.returncode==0,q.stderr

# Read all source as UTF-8 explicitly. The source contains multibyte UTF-8 glyphs
# (em-dash and bullet); a bare read_text() would decode them with the platform default
# (cp1252 on Windows) and corrupt them into mojibake in the release.
html=(root/'index.html').read_text(encoding='utf-8')
concat=''.join((root/'src'/name).read_text(encoding='utf-8') for name in SRC)
node=which_node()

pipeline='baseline'
payload=None
if node and not os.getenv('PRISM_FORCE_BASELINE'):
    mini=run_terser(node,concat)
    if mini is not None:
        ok,err=node_check(node,mini)
        if not ok:
            print(err);sys.exit(3)
        packed=run_roadroller(node,mini)
        if packed is not None:
            payload=packed;pipeline='roadroller'

if payload is None:
    reason='forced baseline test' if os.getenv('PRISM_FORCE_BASELINE') else ('Node not found' if not node else 'terser/roadroller not installed (run: cd tools && npm ci)')
    sys.stderr.write(f'WARNING: optimized Roadroller pipeline unavailable ({reason}); '
                     f'testing baseline Zopfli candidate; existing release is preserved if oversized.\n')
    js=minify_js(concat)
    ok,err=node_check(node,js) if node else (True,'')
    if not ok:
        print(err);sys.exit(3)
    payload=js

# Assemble. For both source-build paths, remove dev <script src> tags, collapse
# whitespace on the HTML shell ONLY, then insert the payload.
shell=re.sub(r'<script src="src/[^>]+></script>','',html)
shell=re.sub(r'>\s+<','><',shell).replace('\r','').replace('\n','')
html=shell.replace('</body>',f'<script>{payload}</script></body>')

data=html.encode();name=b'index.html';crc=binascii.crc32(data)&0xffffffff;date=((2026-1980)<<9)|(8<<5)|15
if zz:
 z=zz.compress(data,numiterations=15);comp=z[2:-4]
else:
 import zlib;comp=zlib.compress(data,9)[2:-4]
local=struct.pack('<IHHHHHIIIHH',0x04034b50,20,0,8,0,date,crc,len(comp),len(data),len(name),0)+name+comp
central=struct.pack('<IHHHHHHIIIHHHHHII',0x02014b50,0x314,20,0,8,0,date,crc,len(comp),len(data),len(name),0,0,0,0,0o644<<16,0)+name
eocd=struct.pack('<IHHHHIIH',0x06054b50,0,0,1,1,len(central),len(local),0)
zipdata=local+central+eocd;size=len(zipdata)
print(f'RELEASE ZIP: {size} / {LIMIT} bytes; REMAINING: {LIMIT-size}; PIPELINE: {pipeline}; ZOPFLI: {bool(zz)}; RAW HTML: {len(data)}')
if size>LIMIT:
 sys.stderr.write('ERROR: candidate exceeds 13 KiB; existing dist release preserved.\n')
 sys.exit(2)
out=root/'dist';out.mkdir(exist_ok=True)
htmp=out/'.index.html.tmp';ztmp=out/'.Prismbound.zip.tmp'
htmp.write_text(html,encoding='utf-8');ztmp.write_bytes(zipdata)
os.replace(htmp,out/'index.html');os.replace(ztmp,out/'Prismbound.zip')
sys.exit(0)
