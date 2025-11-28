#!/usr/bin/env gjs

imports.gi.versions.Gtk = "4.0";
imports.gi.versions.WebKit = "6.0";

const { Gtk, Gio, GLib, WebKit } = imports.gi;

// ------------------------------------------------------------
// Script-anchored index.html
// ------------------------------------------------------------
const scriptFile = Gio.File.new_for_path(
  imports.system.programInvocationName
);

const projectRoot = "/app/share/requinto";
const indexFile = GLib.build_filenamev([
  "/app/share/requinto",
  "src",
  "index.html"
]);
const indexGFile = Gio.File.new_for_path(indexFile);

if (!indexGFile.query_exists(null)) {
  throw new Error(`index.html NOT FOUND at: ${indexFile}`);
}

const indexURI = indexGFile.get_uri();

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

  const settings = webview.get_settings();
  settings.enable_developer_extras = true;
  settings.allow_file_access_from_file_urls = true;
  settings.allow_universal_access_from_file_urls = true;

  webview.load_uri(indexURI);

  win.set_child(webview);
  win.present();
});

app.run([]);
