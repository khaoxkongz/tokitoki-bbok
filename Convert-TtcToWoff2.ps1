param(
    [Parameter(Mandatory, Position = 0)]
    [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
    [string] $InputTtc,

    [Parameter(Position = 1)]
    [string] $OutputDir = (Join-Path (Get-Location) "woff2")
)

$ErrorActionPreference = "Stop"

# ค้นหา Python
$PythonExe = if (Get-Command py -ErrorAction SilentlyContinue) {
    (Get-Command py).Source
}
elseif (Get-Command python -ErrorAction SilentlyContinue) {
    (Get-Command python).Source
}
else {
    throw "ไม่พบ Python กรุณาติดตั้ง Python แล้วเปิด PowerShell ใหม่"
}

$InputPath = (Resolve-Path -LiteralPath $InputTtc).Path

$null = New-Item `
    -ItemType Directory `
    -Path $OutputDir `
    -Force

$OutputPath = (Resolve-Path -LiteralPath $OutputDir).Path

$PythonCode = @'
from pathlib import Path
from fontTools.ttLib import TTCollection
import re
import sys

source = Path(sys.argv[1])
output_dir = Path(sys.argv[2])
output_dir.mkdir(parents=True, exist_ok=True)

def get_name(font, name_id):
    if "name" not in font:
        return None

    for record in font["name"].names:
        if record.nameID == name_id:
            try:
                value = record.toUnicode().strip()
                if value:
                    return value
            except Exception:
                pass

    return None

def safe_filename(value):
    # อักขระที่ใช้ไม่ได้ในชื่อไฟล์ Windows
    value = re.sub(r'[<>:"/\\|?*\x00-\x1f]+', "-", value)
    value = value.rstrip(" .")
    return value or "font"

collection = TTCollection(str(source))

try:
    print(f"พบฟอนต์ทั้งหมด {len(collection.fonts)} รายการ")

    for index, font in enumerate(collection.fonts):
        postscript_name = get_name(font, 6)
        family_name = get_name(font, 1)
        subfamily_name = get_name(font, 2)

        if postscript_name:
            font_name = postscript_name
        elif family_name:
            font_name = family_name
            if subfamily_name:
                font_name += "-" + subfamily_name
        else:
            font_name = f"{source.stem}-{index}"

        font_name = safe_filename(font_name)
        destination = output_dir / f"{index:02d}-{font_name}.woff2"

        font.flavor = "woff2"
        font.save(str(destination))

        print(f"[OK] {destination.name}")
finally:
    collection.close()
'@

$TempScript = Join-Path `
    ([IO.Path]::GetTempPath()) `
    ("ttc-to-woff2-{0}.py" -f [guid]::NewGuid().ToString("N"))

try {
    Set-Content `
        -LiteralPath $TempScript `
        -Value $PythonCode `
        -Encoding UTF8

    & $PythonExe $TempScript $InputPath $OutputPath

    if ($LASTEXITCODE -ne 0) {
        throw "แปลงฟอนต์ไม่สำเร็จ รหัสข้อผิดพลาด: $LASTEXITCODE"
    }

    Write-Host "`nเสร็จแล้ว: $OutputPath"
}
finally {
    Remove-Item -LiteralPath $TempScript -Force -ErrorAction SilentlyContinue
}
