#!/usr/bin/perl
# Trennstellen nach der Regel in .claude/CLAUDE.md ("Worttrennung"):
#  - keine automatische Silbentrennung; erlaubt sind nur Trennungen an der Fuge
#    zusammengesetzter Woerter, beide Teile mindestens 4 Buchstaben
#    -> als &shy; in den Text gesetzt (hyphens: manual beachtet nur diese Stellen)
#  - Bindestrich-Woerter mit einem Teil unter 4 Buchstaben (E-Mail, E-Rechnung, IT-Abteilung)
#    werden nicht am Bindestrich umbrochen -> <span class="nobr">
# Ein Wort gilt als zusammengesetzt, wenn beide Teile (der linke ggf. ohne Fugen-s/-es/-n/-en/-e/-er)
# als eigenstaendige Woerter im Text der Webseite vorkommen (Wortschatz je Sprache aus allen Seiten).
# Aufruf aus dem Repo-Hauptordner:
#   perl .claude/tools/trennstellen.pl --dry de    # nur Vorschlagsliste ausgeben
#   perl .claude/tools/trennstellen.pl de en       # Seiten aendern (idempotent)
use strict; use warnings; use utf8; use open qw(:std :utf8);
use File::Find;
my $dry = 0; my @langs = grep { $_ eq '--dry' ? ($dry = 1, 0) : 1 } @ARGV;
@langs = ('de', 'en') unless @langs;
my $MINPART = 4; my $MINWORD = 10;

# Woerter, die nie getrennt werden (Marken, Namen, Fachbegriffe, die keine Zusammensetzung sind)
my %never = map { lc($_) => 1 } qw(
  Supervision JavaScript TypeScript ActiveSync CalDAV CardDAV Birgit
  Alternative Alternativen Alternativ alternative alternativen alternativ Rocketchat Engineering
  EGroupware Nextcloud Owncloud Univention Collabora Rocket Guacamole Kubernetes Thunderbird
  Synchronisation Synchronisierung Authentifizierung Verschluesselung Verschlüsselung Veranstaltungen
  Administratoren Administratorinnen Funktionalitäten Digitalisierung Personalisierung
);
# rechte Teile, die in Wahrheit Endungen sind
my %badright = map { $_ => 1 } qw(heit keit schaft lich liche lichen licher isch ische ischen
  ability abilities able ably ible fully fulness less lessly ness nesses ance ances ence ences antes ment ments
  innen barkeit barkeiten igen ige iger igem igens esten este ester estem ierung ierungen ieren tion tionen ation ationen ität itäten ismus isten istin ungen lungen
  toren tor tern rung rungen gung gungen ende enden ender lose losen bare baren);

sub pages { my ($lang) = @_; my @f; find(sub { push @f, $File::Find::name if /\.html$/ && $File::Find::name !~ /vorschau-/ }, $lang); sort @f }
sub textnodes {   # ruft $cb fuer jeden sichtbaren Textabschnitt im <body> auf, gibt neues HTML zurueck
  my ($html, $cb) = @_;
  my ($head, $body, $tail) = $html =~ m{\A(.*?<body[^>]*>)(.*)(</body>.*)\z}s or return $html;
  my @parts = split m{(<(?:script|style|pre|code|kbd|samp|svg|textarea)\b.*?</(?:script|style|pre|code|kbd|samp|svg|textarea)>|<!--.*?-->|<[^>]+>)}s, $body;
  for (my $i = 0; $i < @parts; $i += 2) { $parts[$i] = $cb->($parts[$i]) if defined $parts[$i] && length $parts[$i]; }
  return $head . join('', map { defined $_ ? $_ : '' } @parts) . $tail;
}
my $WORD = qr{(?<![&#\p{L}])\p{L}+(?:&shy;\p{L}+)*};

for my $lang (@langs) {
  my @files = pages($lang);
  # 1. Wortschatz
  my %lex;
  for my $f (@files) {
    local $/; open my $h, '<:utf8', $f or die; my $p = <$h>; close $h;
    textnodes($p, sub { my $t = shift; (my $u = $t) =~ s/&shy;//g; $lex{lc $1}++ while $u =~ /(?<![&#\p{L}])(\p{L}{$MINPART,})/g; $t });
  }
  my @fugen = $lang eq "de" ? ("", "s", "es", "n", "en") : ("");
my %badleft = map { $_ => 1 } qw(zuge ange abge ausge einge vorge inter);
  my %memo;
  my $known = sub { my $w = shift; exists $lex{$w} && !$badright{$w} };
  # linker Teil: Wort (ggf. + Fugenelement); Rueckgabe Rang (0 = ohne Fuge oder Fugen-s, 1 = sonstige Fuge) oder undef
  my $leftok = sub { my $l = shift; return undef if $badleft{$l}; my $rank;
    for my $fg (@fugen) { next if length($l) - length($fg) < $MINPART; next unless $l =~ /\Q$fg\E\z/;
      my $stem = $fg eq '' ? $l : substr($l, 0, length($l) - length($fg));
      next unless exists $lex{$stem} && !$badright{$stem} && !$badleft{$stem};
      my $r = ($fg eq '' || $fg eq 's') ? 0 : 1; $rank = $r if !defined $rank || $r < $rank; }
    $rank };
  my $split; $split = sub {   # liefert Teile oder undef
    my $w = shift; return $memo{$w} if exists $memo{$w};
    my ($best, $bestrank);
    for my $i (reverse $MINPART .. length($w) - $MINPART) {   # bei gleichem Rang: laengster linker Teil
      my ($l, $r) = (substr($w, 0, $i), substr($w, $i));
      my $rank = $leftok->($l); next unless defined $rank;
      next unless $known->($r);
      next if defined $bestrank && $rank >= $bestrank;
      my $sub = length($r) >= 2 * $MINPART ? $split->($r) : undef;
      ($best, $bestrank) = ([$l, $sub ? @$sub : $r], $rank);
      last if $rank == 0;
    }
    return $memo{$w} = $best;
  };
  my %plan;   # wort -> getrennte Fassung
  my $hy = sub {
    my $t = shift;
    $t =~ s{&shy;}{}g;   # immer neu berechnen
    $t =~ s{($WORD)}{
      my $w = $1;
      if (length($w) < $MINWORD || $never{lc $w} || $w =~ /.\p{Lu}/) { $w }
      else { my $parts = $split->(lc $w);
        if ($parts) { my $pos = 0; my @o; for my $pt (@$parts) { push @o, substr($w, $pos, length $pt); $pos += length $pt } my $r = join('&shy;', @o); $plan{$w} = $r; $r } else { $w } }
    }ge;
    # Bindestrich-Ketten: ein Bindestrich mit einem Nachbarteil unter 4 Buchstaben wird nicht umbrochen.
    # Zusammenhaengende geschuetzte Teile kommen in <span class="nobr">, z. B. <nobr>E-Mail</nobr>-Adresse
    $t =~ s{(?<![\p{L}\-])(\p{L}+(?:&shy;\p{L}+)*(?:-\p{L}+(?:&shy;\p{L}+)*)+)(?![\p{L}\-])}{
      my @p = split /-/, $1; my $len = sub { (my $x = shift) =~ s/&shy;//g; length $x };
      my @seg = ([$p[0]]);
      for my $i (1 .. $#p) {
        if ($len->($p[$i - 1]) < $MINPART || $len->($p[$i]) < $MINPART) { push @{$seg[-1]}, $p[$i] } else { push @seg, [$p[$i]] }
      }
      join '-', map { @$_ > 1 ? '<span class="nobr">' . join('-', @$_) . '</span>' : $_->[0] } @seg;
    }ge;
    $t;
  };
  my $changed = 0;
  for my $f (@files) {
    local $/; open my $h, q{<:utf8}, $f or die; my $p = <$h>; close $h; my $orig = $p;
    $p =~ s{<span class="nobr">(.*?)</span>}{$1}g;      # nobr neu berechnen (idempotent)
    my $n = textnodes($p, $hy);
    next if $n eq $orig; $changed++;
    unless ($dry) { open $h, '>:utf8', $f or die; print $h $n; close $h; }
  }
  if ($dry) { print "$lang\t$_\t$plan{$_}\n" for sort keys %plan; }
  print STDERR "$lang: ", scalar(keys %plan), " Woerter mit Trennstellen, ", ($dry ? "wuerde $changed Dateien aendern" : "$changed Dateien geaendert"), "\n";
}
