---
title: Hosting Joplin on Raspberry Pi
datePublished: 2025-07-11
tags: ["homelab", "productivity", "joplin"]
---

## Backstory

### Self-hosted

I've become increasingly interested in self-hosting over the past few years. I
manage all my own business and client websites myself on a VPS, but I've never
had much interest in building a homelab. My Raspberry Pi 1B I got as a gift many
years ago has just been sitting in a box as I never came up with a proper use
for it. I did install and boot it once or twice and played some
[Minecraft](https://minecraft.wiki/w/Pi_Edition) but that was pretty much it.

### Google Keep

I use Google Keep a lot. It's my second most used app on my phone right after
web browser and I have a tab ready on my desktop whenever I need quickly to
write something down. However, as many others in tech (and even non-tech)
circles, I've become a little concerned about privacy with the rise of AI. I've
also always liked the idea of owning your own data.

This is why I've been researching alternative note taking apps from time to
time, but never really committed to even trying anything different. A [recent
video by a popular YouTuber](https://www.youtube.com/watch?v=u_Lxkt50xOg)
rekindled my interest in the subject and this time I decided on a whim to
actually do something about it.

### Alternative

I did some research and landed on [Joplin](https://joplinapp.org/). As I said,
I've been researching these for a while and decided to pick one that seems to be
popular (and [works with
Nextcloud](https://nextcloud.com/blog/mobile-note-taking-with-your-private-cloud-announcing-joplinnextcloud-integration/)
as that's what I'm _really_ interested in).

Now, obviously I need to sync the notes so that's what I researched next. I
could rent a server to host Nextcloud, but I feel like starting small and I do
have that unused Raspberry Pi...

### On Raspberry Pi

Joplin [syncs with WebDAV](https://joplinapp.org/help/apps/sync/webdav/) so I
just need to find and host a lightweight WebDAV server. So I search for
"lightweight webdav server" and look at the first one that comes up:
[KaraDAV](https://github.com/kd2org/karadav). It's written in PHP (which I'm
very experienced in), uses SQLite3 (which I use and am a fan of) and supports
Nextcloud (don't know if I need it, but I like the word "Nextcloud"). It's
perfect so let's get started!

## Day 1 - DietPi

### Picking a Distro

Let's start with Linux fan's favorite: picking a distro. My Raspberry Pi model B
isn't very powerful so I want something that's lightweight. I also want
something that's easy to install headlessly as I want to try to get it running
without connecting a keyboard or a display and just SSH in.

After some research (and briefly considering [Alpine
Linux](https://wiki.alpinelinux.org/wiki/Raspberry_Pi) as I've used it with
Docker) I decided on [DietPi](https://dietpi.com/). I took my Pi out of the
storage box, grabbed the memory card, formatted it a few times and eventually,
after a bit of messing around with partitions, I had a blank 32GB SD card ready
to go.

### Flashing Once, Flashing Twice

Now I have the DietPi ISO and an empty SD card. The [DietPi installation
instructions](https://dietpi.com/docs/install/) lay out the installation steps
pretty clearly:

> At first, download and install [balenaEtcher](https://etcher.balena.io/). This
> application flashes OS images to SD cards and USB drives, safely and easily on
> Windows, macOS, Linux.

So what do I do? I've installed Linux before so obviously I know what I'm doing.
I ignore the instructions and use [Ventoy](https://www.ventoy.net/en/index.html)
instead as that's what I've used before. Just copy the ISO to the SD card and be
done with it.

I want this installation to be headless and remember Ventoy having a boot
menu, so I spend some time learning how to configure Ventoy to automatically
launch the distro so I don't have to plug in a monitor or a keyboard. I also did
some configuring for [automated install at
boot](https://dietpi.com/docs/usage/#how-to-do-an-automatic-base-installation-at-first-boot-dietpi-automation),
but eventually realized that DietPi allows me to SSH in to complete the install
manually, which seemed like a better option.

So now I have an SD card with a headless install (and further manual
configuration via SSH) ready to go. So I plop the SD card into the Pi, plug the
power and network cables in and wait. I decide to give it 15 minutes to install
itself as I know the Pi is slow.

As I wait for the installation, I research my options for a dynamic DNS setup. I
look at my domain provider, [DietPi
DDNS](https://dietpi.com/docs/dietpi_tools/software_installation/#dietpi-ddns)
and my router configuration to figure out the best way to do it. As I'm going
through my router config to see if that would be a good place to set up DDNS,
I'm beginning to wonder why the LAN port Pi is connected to doesn't show up in
the network chart.

Eventually I give in, grab a spare monitor and plug it into the Pi. Nothing.
Hard reboot. Nothing. So it's a boot issue. Granted, I could've figured this out
by just looking at the single bright red LED on the Pi, but it's been _a while_
since I last saw those LEDs light up so I don't remember how it's supposed to
look.

After some quick research I find out that my old Pi doesn't support the
architechture or boot system or whatever it is that Ventoy uses. Oops! I guess I
should've followed the instructions and used balenaEtcher instead. So I format
and flash the SD card again, this time with balenaEtcher, and plop it back into
the Pi. Success! Now more LEDs light up and there's terminal output on the
monitor. The Pi also shows up in the router network chart. I unplug the monitor
and commend myself for at least not having to connect a keyboard and let the
installation run.

### DietPi Configuration

After taking a break, I `ssh root@192.168.1.xxx` and let the installation
complete. Configure locale, timezone and keyboard layout and explore what DietPi
has to offer. Since I know KaraDAV runs on PHP and SQLite, I install [LLSP web
stack](https://dietpi.com/docs/software/webserver_stack/#llsp-web-stack). That's
all I need for now, although I do spend some time checking out the DDNS options.

I decided to do the DDNS on the Pi instead of my router, but as it seems like I
need to use a custom script (as DietPi doesn't support my domain provider out of
the box), I leave that (and LetsEncrypt and firewall setup) for later. I do some
preliminary networking setup (mainly static IP lease) from the router.

### My Personal Terminal

Time for the fun part. Getting my personal configuration on the system. I
`adduser` myself, acquire `sudo` powers and log in.

First, I install [Starship](https://starship.rs/) and
[fzf](https://junegunn.github.io/fzf/). For fzf, I use a precompiled binary from
GitHub instead of [Homebrew](https://brew.sh/) because I want to keep the Pi
light. It's not that Homebrew is too hevay (or is it? I don't know), but more of
"I don't install it unless I absolutely need it". Git, however, is something I
do need soon, so I `sudo apt install git`.

My [dotfiles](https://github.com/Cryszon/dotfiles) are managed with
[chezmoi](https://www.chezmoi.io/) and that's what I needed Git for. So I
install chezmoi and `chezmoi init --apply
https://github.com/Cryszon/dotfiles.git`. I also figured out I need to use
`https://` instead of `git@` to clone without credentials. Always learning (or
maybe remembering what I forgot) I guess.

After some more tinkering with dotfiles I now had my personal configuration
ready. Next, I need to get KaraDAV server up.

### KaraDAV on lighttpd

I had used Apache and nginx before, but [lighttpd](https://www.lighttpd.net/)
was new to me. KaraDAV has [installation
instructions](https://github.com/kd2org/karadav/blob/main/doc/INSTALL.md) for
Apache and nginx, so I "just" needed to learn lighttpd configuration and
translate the config. However, because I don't have a domain pointed at my
server yet, and I decided I want to serve KaraDAV from a subdirectory, this
wasn't so straightforward.

It took me a couple hours of trial and error, but I eventually managed to get
everything working. I'll spare you the details and just give a rough guide on
what to do.

1. Install KaraDAV to `/var/www/servers/example.com/karadav/` and navigate to
   the directory
2. Set owner to allow KaraDAV to write files: `chown -R . www-data:www-data`
3. Create KaraDAV configuration file: `cp config.dist.php config.local.php`
4. Set following options in `config.local.php`:

```php
// This disables thumbnail generation to save resources and avoid having to
// install imagick
const THUMBNAIL_CACHE_PATH = NULL;

// This is needed to run KaraDAV in a subdirectory and needs to be changed later
// after setting up the domain
const WWW_URL = 'http://192.168.0.xxx/karadav/';
```

5. Enable `10-rewrite.conf` for lighttpd
6. Add following lighttpd configuration:

```ini
alias.url += ( "/karadav" => "/var/www/servers/example.com/karadav/www/" )

$HTTP["url"] =~ "^/karadav/.+" {
  url.rewrite-if-not-file = ( "" => "/servers/example.com/karadav/www/_router.php${qsa}" )
}
```

I now had the KaraDAV server up and running. Time to see if Joplin can replace
Google Keep for me.

## Day 2 - Joplin

It took me less than 10 minutes to download and install Joplin on my desktop and
set up sync to KaraDAV. Then I did the same for my Android phone. I now had
notes synced through my local network. Finally, I enabled
[E2EE](https://joplinapp.org/help/apps/sync/e2ee/) for my notes. My plan is to
now use Joplin for some of my personal daily note taking to see how I like it.

## Joplin impressions after a week

It's been a little over a week and I've only opened Keep a few times to check my
older notes. I really like Joplin. It's not quite as fast to open from a "cold
boot" on Android as Keep, but once it's running the editing experience is way
better.

The number one feature for me in Joplin is Markdown support. I'm already using
Markdown pretty much everywhere and even tended to write my Keep notes using
Markdown syntax despite Keep having its own formatting options. Having editor
buttons map directly to Markdown (especially on mobile) is a welcome
improvement. I can now tap a single button to make a checkbox instead of
writing `- [ ]` one character at a time. The **Insert Time** button
is also very handy, since I often use dates and times in my notes.

I also feel good about is owning my data. I know that my notes are encrypted on
my own server instead of being fed as training data to a LLM or used for a
"personalized experience" (i.e. advertising).

## Joplin customization

I took some time to customize Joplin to my liking. I'm cautious deviating from
"vanilla" experiences unless I really need to, so I didn't install any plugins
yet, but here are some things I did:

### Changing application layout

I changed application layout (**View -> Change application layout**) so that
there's a single side bar on the left with notes on top and notebooks on bottom.
I didn't realize this was possible until a few days in and it was a complete
game changer for me.

### Launching Joplin on Windows startup

Having my browser always open made accessing my Keep notes as simple as pressing
<kbd>Ctrl+T -> K -> Enter</kbd> and I wanted to be able to get to Joplin quickly
as well. For this, I enabled **Show tray icon** and **Start application
minimized in the tray icon** in the application settings. Then I just added a
shortuct to Joplin to `%userprofile%\AppData\Roaming\Microsoft\Windows\Start
Menu\Programs\Startup`.

I use the tray icon to open Joplin as using start menu or taskbar seems to
relaunch it, which takes longer.

### Other customizations

I chose "Aritim Dark" as theme on both desktop and mobile and changed some
keyboard shortcuts to match my VS Code setup.

## Basic security

I mentioned about DDNS earlier, but so far I've only synced between my desktop
and phone and haven't had the need to access the Pi from outside my local
network. Nevertheless, I did the following very basic security steps to prepare
for when I eventually do, as I also have a tablet I sometimes use.

- Disabled root and password login for
  [Dropbear](https://dietpi.com/docs/software/ssh/#dropbear)

```ini
# /etc/default/dropbear

# -w = Disallow root logins
# -s = Disable password logins
DROPBEAR_EXTRA_ARGS="-w -s"
```

- Installed
  [Fail2Ban](https://dietpi.com/docs/software/system_security/#fail2ban) using
  DietPi-Software.

- Configured UFW to only allow SSH traffic from inside local network

```sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.0.0/16 to any port 22
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

- Enabled automatic updates

```ini
# /boot/dietpi.txt

CONFIG_CHECK_APT_UPDATES=2
```

## Conclusion

There's still more to do, such as migrating my hundreds of old notes from Keep
or setting up WAN access, but I'll get to them eventually. So far I'm happy with
the setup I have and I'm especially glad I finally got to put my Pi to use after
all these years.
