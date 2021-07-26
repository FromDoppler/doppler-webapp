zE('webWidget', 'setLocale', 'es');
	window.zESettings = {
		webWidget: {
			offset: {
				horizontal: '25px',
				vertical: '55px',
				mobile: {
					horizontal: '-7px',
					vertical: '56px'
				}
			},
			launcher: {
				chatLabel: {
					'*': "Chat"
				}
			},
			chat: {
				title: {
					'*': 'Customer Support Chat',
					'en-US': 'Customer Support Chat',
					es: 'Atención al Cliente'
				},
				offlineForm: {
					greeting: {
						'*': "How can we help you? Leave us a message and we’ll contact you soon.",
						'en-US': "How can we help you? Leave us a message and we’ll contact you soon.",
						es: "¿En qué podemos ayudarte? Déjanos un mensaje y nos contactaremos pronto."
					}
				},
				prechatForm: {
					greeting: {
						'*': 'Hi! We’re here to help you. Tell us about your questions or request.',
						'en-US': 'Hi! We’re here to help you. Tell us about your questions or request.',
						es: '¡Hola! Estamos aquí para ayudarte. Cuéntanos sobre tu consulta o solicitud.'
					}
				}
			},
		}
	};

// hide bubble after certain time
window.onload = function() {
  setTimeout(function() {
    document.getElementById('titlediv').style.visibility = 'hidden';
  }, 12000);
};
