// ==UserScript==
// @name         SteamAutoGameQueue (Card Bot)
// @namespace    https://github.com/mig4ng/SteamAutoGameQueue
// @version      0.7
// @description  Reminds you to check if you have cards to obtain by checking the queue steam arranged for you and auto completes it for you.
// @author       mig4ng
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://store.steampowered.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var type = "fast"; // change between fast and slow, fast one creates a button for a quick completition of the 3 daily queues, slow goes app by app and you can see the apps you like
var alerts = true; // change to false if you don't want the alerts
var donateAlerts = true; // change to false if you don't want the annoying tab to open everytime, btw consider donating a card or a cheap skin if you found this script somewhat useful
var maxTime = 6000; // max time in miliseconds between the load of the page and the button pressing
var minTime = 500; // min time in miliseconds between the load of the page and the button pressing

if(type=="fast"){
    if ($('div.discover_queue_empty_refresh_btn').length) {
        $( "<div class='autoQueueBox'><h2>Steam Auto Queue (Card Bot)</h2><div class='discover_queue_empty winter_sale' style=''><div class='discover_queue_empty_refresh_btn'><span class='btnv6_lightblue_blue btn_medium' id='instant_queue_btn'><span>Complete 3 queues&gt;&gt;</span></span></div><div class='discovery_queue_winter_sale_where_trading_cards'>Did you like the script? <a href='https://steamcommunity.com/tradeoffer/new/?partner=107239973&amp;token=OacSUh60'>Donate me</a> a card you got duplicate or a cheap skin, thanks!</div>" ).insertBefore( ".discovery_queue_apps" );
        $( "#instant_queue_btn" ).click(function() {
            GenerateQueue(0);
        });
    }
    if ($('span.queue_sub_text').length || $('span.finish_queue_text').length) {
        $J('#next_in_queue_form').submit();
    }
} else {
    if ($('span.queue_sub_text').length) {
        setTimeout(function(){ $J('#next_in_queue_form').submit(); }, (maxTime-minTime)*Math.random() + minTime);
    }
    if ($('span.finish_queue_text').length) {
        setTimeout(function(){ $J('#next_in_queue_form').submit(); }, (maxTime-minTime)*Math.random() + minTime);
    }
    if ($('div.discover_queue_empty_refresh_btn').length) {
        if(donateAlerts){
            $( "<h3 class='donateAuthor'>Consider donating a duplicate card that you got or a cheap skin if you found this script somewhat useful!</h3>" ).insertAfter( ".discovery_queue_winter_sale_cards_header" );
            $( "<h3 class='donateTradeOffer'><a href='https://steamcommunity.com/tradeoffer/new/?partner=107239973&token=OacSUh60' target='_blank'>Send me a trade offer, consider it a Christmas Gift :)</a></h3>" ).insertAfter( ".donateAuthor" );
        }
        if(alerts){
            alert("If you still have cards for today to obtain by completing the queue click start and the script will complete the queue for you!");
        }
    }
}

// Thanks to xPaw for sharing this piece of code https://gist.github.com/xPaw/73f8ae2031b4e528abf7
var GenerateQueue = function( queueNumber ){
    $J('#instant_queue_btn').html("<span>Queue #" + ++queueNumber + " is running...</span>");
    jQuery.post( 'http://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 } ).done( function( data ){
        var requests = [];
        for( var i = 0; i < data.queue.length; i++ ){
            requests.push( jQuery.post( 'http://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID } ) );
        }
        jQuery.when.apply( jQuery, requests ).done( function(){
            if( queueNumber < 3 ){
                GenerateQueue( queueNumber );
            } else {
                $J('#instant_queue_btn').html("<span>Queues finished. Come back tomorrow.</span>");
            }
        });
    });
};
