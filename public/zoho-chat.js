var langRes = {
  es: {
    online: {
      legend: '¡Hola! Estamos aquí para ayudarte',
    },
    offline: {
      legend: '¡Hola! Estamos offline. Déjanos un mensaje:)',
    },
  },
  en: {
    online: {
      legend: 'Hi! We’re here if you need some help :)',
    },
    offline: {
      legend: 'Hi! We’re offline now. We’ll be back ASAP :)',
    },
  },
};

var $zoho = $zoho || {};
$zoho.salesiq = $zoho.salesiq || {
  widgetcode: '44b76224430b91326cb02039d609a5e008e7fe0266102a0ce5060b5c1ff1e0ee',
  values: {},
  ready: function() {
    var lang = 'es'; /*change this in the future*/
    var chatResources = lang === 'en' ? langRes.en : langRes.es;
    $zoho.salesiq.language('es'); //we need this hardcoded, only the bubble changes languages
    $zoho.salesiq.chatbutton.texts([
      [chatResources.online.legend, 'Online'],
      [chatResources.offline.legend, 'Offline'],
    ]);
    $zoho.salesiq.customfield.add({
      name: '_default.name',
      hint: '¿Cómo te llamas?',
      type: 'text',
      required: 'true',
      visibility: 'both',
    });
    $zoho.salesiq.customfield.add({
      name: '_default.email',
      hint: '¿Cuál es tu Email?',
      type: 'email',
      required: 'true',
      visibility: 'both',
    });
    $zoho.salesiq.floatwindow.onlinetitle('¿En qué podemos ayudarte?');
    $zoho.salesiq.floatwindow.offlinetitle('¿En qué podemos ayudarte?');
    $zoho.salesiq.domain('fromdoppler.com');
    $zoho.salesiq.chatbutton.width('205');
  },
};

var zohoScript = document.createElement('script');
zohoScript.type = 'text/javascript';
zohoScript.id = 'zsiqscript';
zohoScript.defer = true;
zohoScript.src = 'https://salesiq.zoho.com/widget';

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(zohoScript, firstScript);
document.write("<div id='zsiqwidget'></div>");

// hide bubble after certain time
window.onload = function() {
  setTimeout(function() {
    document.getElementById('titlediv').style.visibility = 'hidden';
  }, 12000);
};
