<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="fa/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <title></title>
            <?php
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
            <b><a class="navbar-brand" href="index.html"><img src="images/ffrn_logo.svg"></a></b>
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
<div class="container main">
    <div class="row">
        <div class="col-sm-8">
        <h1>Blog</h1>
<?php
$posts = get_posts('numberposts=10&order=ASC&orderby=post_title');
foreach ($posts as $post) : setup_postdata( $post ); ?>
<div class="post">
    <h2><?php the_title(); ?></h2>
    <section><?php the_content(); ?></section>
    <div class="date"><?php the_date();?></div>
</div>
<hr>
<?php
endforeach;
?>
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
                <li><a href="">Map</a></li>
                <li><a href="">Wiki</a></li>
                <li><a href="">Firmware Download</a></li>
                <li><a href="">Knotenverwaltung</a></li>
            </ul>
        </div>
        <div class="col-sm-4 footer-links footer-social">
            <h4>Social & Kontakt</h4>
            <hr>
            <ul>
                <li><a href="kontakt.html"><i class="fa fa-twitter"></i> Twitter</a></li>
                <li><a href="rechtliches.html"><i class="fa fa-comments-o"></i> IRC</a></li>
                <li><a href="#"><i class="fa fa-paper-plane"></i> Mailing Liste</a></li>
                <li><a href="ueber-uns.html"><i class="fa fa-life-ring"></i> Ansprechpartner</a></li>
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
