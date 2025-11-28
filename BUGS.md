# Requinto Debugging Report

This document records all major blockers encountered while getting `requinto.js` to correctly load and run the WebKit-based UI from local files using GJS, GTK4, and WebKitGTK.

---

## 1. Directory Listing Instead of App UI

### Symptom
The app window showed:

Directory listing for /

### Root Cause
WebKit was being pointed at a directory or invalid `file://` path instead of an actual HTML file.

### Fix
- Hard-anchored the app to:
  src/index.html
- Loaded the file using:
  webview.load_uri(indexURI)

---

## 2. GLib.realpath Does Not Exist in GJS

### Symptom
TypeError: GLib.realpath is not a function

### Root Cause
GLib.realpath() is not exposed in GJS.

### Fix
Path resolution was rewritten using Gio.File instead.

---

## 3. ARGV[0] Is Undefined Under Shebang Execution

### Symptom
Crashes when using ARGV[0].

### Root Cause
When running ./requinto.js, GJS may not populate ARGV.

### Fix
Stopped using ARGV entirely and resolved script paths using:
imports.system.programInvocationName

---

## 4. webview.load_file() Not Available

### Symptom
TypeError: webview.load_file is not a function

### Root Cause
Older WebKitGTK versions do not implement load_file().

### Fix
Reverted to the universal method:
webview.load_uri(indexURI)

---

## 5. <base href="/"> Exposed the Real Filesystem Root

### Symptom
The app jumped to:
file:///

### Root Cause
The HTML tag:
<base href="/">
forces absolute root resolution under file://

### Fix
Changed to:
<base href="./">

---

## 6. Canvas Loaded but Fretboard Did Not Draw

### Symptom
- UI text appeared
- Canvas existed
- No fretboard drawing appeared

### Root Cause
ES module imports were blocked under file:// by WebKit CORS rules.

Console error:
Origin null is not allowed by Access-Control-Allow-Origin

### Fix (Critical)
Enabled file access in WebView settings:
- allow_file_access_from_file_urls = true
- allow_universal_access_from_file_urls = true

This allowed:
import "./draw.js"
import "./songs.js"
to work correctly.

---

## 7. GTK Inspector vs WebKit DevTools Confusion

### Symptom
Only the GTK inspector appeared — no JavaScript console.

### Root Cause
GTK Inspector is not the WebKit JavaScript inspector.

### Fix
Enabled real WebKit devtools via:
enable_developer_extras = true
Then opened with:
Ctrl + Shift + I

---

## Final Verified Working State

- requinto.js loads src/index.html
- ES modules work under file://
- Canvas drawing works
- Audio playback works
- No filesystem root exposure
- Ready for Flatpak packaging

---

## Key Lesson

Apps that work under:
http://localhost

often fail under:
file://

unless:
- The <base> tag is correct
- CORS is explicitly allowed
- ES module access is enabled
