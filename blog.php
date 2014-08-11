<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="fa/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <title>Blog | Freifunk Rhein-Neckar</title>
    <?php
        define('WP_USE_THEMES', false);
        require('blog/wp-blog-header.php');
    ?>
</head>
<body>
<nav id="navigation" class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-navbar">
                <span class="sr-only">Toggle navigation</span>
                <i class="fa fa-bars"></i>
            </button>
            <b><a class="navbar-brand" href="index.html"><img src="images/ffrn_logo.svg" alt="logo"></a></b>
        </div>
        <div class="collapse navbar-collapse pull" id="main-navbar">
            <ul class="nav navbar-nav">
                <li><a href="index.html">Home</a></li>
                <li><a href="die_idee.html">Die Idee</a></li>
                <li><a href="mitmachen.html">Mitmachen</a></li>
                <li class="active"><a href="blog.php">Blog</a></li>
                <li><a href="faq.html">FAQ</a></li>
                <li><a href="kontakt.html">Kontakt</a></li>
            </ul>
        </div>
    </div>
    <div class="header-line"></div>
</nav>
<div class="container main blog">
    <div class="row">
        <div class="col-sm-8">
            <h1>Blog</h1>
            <hr>
            <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
            <div class="panel panel-default">
                <div class="panel-heading"><h4><a href="blog.php?p=<?php the_ID(); ?>" rel="bookmark"><?php the_title(); ?></a></h4></div>
                <div class="panel-body">
                    <section><?php the_content(); ?></section>
                    <div class="meta">Geschrieben am <span class="date"><?php the_date();?></span> von <span class="author"><?php the_author();?></span></div>
                </div>
            </div>
            <?php endwhile; ?>
             <div class="navigation">
                <div class="newer"><?php previous_posts_link('&laquo; Neuere Einträge') ?></div>
                <div class="older"><?php next_posts_link('Ältere Einträge &raquo;','') ?></div>
             </div>
            <?php else : ?>
                <h4>Noting found</h4>
            <?php endif; ?>
        </div>
    </div>
</div>
<footer>
    <div class="container">
        <div class="col-sm-4 footer-links">
            <h4>INFO</h4>
            <hr>
            <a href="mailto:info@freifunk-rhein-neckar.de">info@freifunk-rhein-neckar.de</a>
            <hr>
            <address>
                <strong>Freifunk Rhein Neckar e.V.i.G</strong><br>
                c/o Ben Oswald<br>
                Fichtestr. 75<br>
                D-69469 Weinheim<br>
            </address>
            <hr>
        </div>
        <div class="col-sm-4 footer-links">
            <h4>Links</h4>
            <hr>
            <ul>
                <li><a target="_blank" href="http://map.freifunk-rhein-neckar.de/">Map</a></li>
                <li><a target="_blank" href="https://w.ffrn.de">Wiki</a></li>
                <li><a target="_blank" href="http://fw.freifunk-rhein-neckar.de">Firmware Download</a></li>
                <li><a target="_blank" href="https://register.freifunk-rhein-neckar.de/">Knotenverwaltung</a></li>
            </ul>
        </div>
        <div class="col-sm-4 footer-links footer-social">
            <h4>Social & Kontakt</h4>
            <hr>
            <ul>
                <li><a target="_blank" href="https://twitter.com/FFRheinNeckar"><i class="fa fa-twitter"></i> Twitter</a></li>
                <li><a target="_blank" href="irc://irc.hackint.org/freifunk-rhein-neckar"><i class="fa fa-comments-o"></i> IRC</a></li>
                <li><a target="_blank" href="https://lists.ffrn.de/"><i class="fa fa-paper-plane"></i> Mailingliste</a></li>
                <li><a target="_blank" href="https://w.ffrn.de/kontakt"><i class="fa fa-life-ring"></i> Ansprechpartner</a></li>
                <li><a target="_blank" href="https://github.com/Freifunk-Rhein-Neckar"><i class="fa fa-github"></i> GitHub</a></li>
                <li><a target="_blank" href="https://www.facebook.com/freifunkrheinneckar"><i class="fa fa-facebook-square"></i> Facebook</a></li>
            </ul>
        </div>
    </div>
</footer>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/headroom.min.js"></script>
<script src="js/headroom.conf.js"></script>
</body>
</html>
