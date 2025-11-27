#!/usr/bin/env gjs

imports.gi.versions.Gtk = "4.0";
imports.gi.versions.WebKit = "6.0";

const { Gtk, Gio, GLib, WebKit } = imports.gi;

// ------------------------------------------------------------
// App Paths
// ------------------------------------------------------------
const APP_DIR = GLib.get_current_dir();
const PORT = 38423;
const URL = `http://127.0.0.1:${PORT}/`;

// ------------------------------------------------------------
// Spawn Local HTTP Server (CORRECT WAY)
// ------------------------------------------------------------
const launcher = new Gio.SubprocessLauncher({
  flags: Gio.SubprocessFlags.STDOUT_SILENCE |
         Gio.SubprocessFlags.STDERR_SILENCE
});

launcher.set_cwd(APP_DIR);

const server = launcher.spawnv([
  "python3",
  "-m",
  "http.server",
  `${PORT}`
]);

// Give the server time to start
GLib.usleep(300_000);

// ------------------------------------------------------------
// GTK + WebKit App
// ------------------------------------------------------------
const app = new Gtk.Application({
  application_id: "social.whereis.requinto",
  flags: Gio.ApplicationFlags.FLAGS_NONE
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

  settings.enable_javascript = true;
  settings.enable_developer_extras = true;

  webview.load_uri(URL);

  win.set_child(webview);
  win.present();

  // Clean shutdown of server
  win.connect("close-request", () => {
    server.force_exit();
    return false;
  });
});

app.run([]);

