#!/usr/bin/env gjs

imports.gi.versions.Gtk = "4.0";
imports.gi.versions.WebKit = "6.0";

const { Gtk, Gio, GLib, WebKit } = imports.gi;

// ------------------------------------------------------------
// ✅ SCRIPT-ANCHORED PATH (NOT CWD)
// ------------------------------------------------------------

const scriptFile = Gio.File.new_for_path(
  imports.system.programInvocationName
);

const projectRoot = scriptFile.get_parent().get_path();
const indexFile = GLib.build_filenamev([projectRoot, "src", "index.html"]);
const indexGFile = Gio.File.new_for_path(indexFile);

// ------------------------------------------------------------
// ✅ HARD FAIL IF FILE IS MISSING
// ------------------------------------------------------------

if (!indexGFile.query_exists(null)) {
  printerr("PROJECT_ROOT:", projectRoot);
  printerr("INDEX_FILE:", indexFile);
  throw new Error("index.html NOT FOUND");
}

// ------------------------------------------------------------
// ✅ CONVERT FILE → URI SAFELY
// ------------------------------------------------------------

const indexURI = indexGFile.get_uri();

// ------------------------------------------------------------
// GTK + WebKit App
// ------------------------------------------------------------

const app = new Gtk.Application({
  application_id: "social.whereis.requinto"
});

app.connect("activate", () => {
  const win = new Gtk.ApplicationWindow({
    application: app,
    title: "Requinto",
    default_width: 900,
    default_height: 600
  });

  const webview = new WebKit.WebView();

  // ✅ UNIVERSAL API — NO DIRECTORY FALLBACK POSSIBLE
  webview.load_uri(indexURI);

  win.set_child(webview);
  win.present();
});

app.run([]);

