Mousetrap.bind('space', () => {
  focus('#isbn-in');
}, 'keyup');


$('#isbn-in').on('input', () => {
  const isbnIn  = $('#isbn-in').val();
  const isbnOut = $('#isbn-out');
  const isbn    = toIsbn(isbnIn);

  if (isbn) {
    toClipboard(isbn);
    focus('#isbn-in');
    isbnOut.text(isbn);
    isbnOut.attr('href', google('ean '.concat(isbnIn)));
  } else {
    const hz = hanzi();
    isbnOut.text(hz);
    isbnOut.attr('href', google(hz));
  }
});


$('#isbn-in').keyup(e => {
  if (e.keyCode === 13) {
    toClipboard($('#isbn-out').text());
    focus('#isbn-in');
  } else if (e.keyCode === 16) {
    background($('#isbn-in').val());
  }
});


const toIsbn = x =>
  /^\d{13}$/.test(x)
    ? [ x.substr( 0, 3),
        x.substr( 3, 1),
        x.substr( 4, 3),
        x.substr( 7, 5),
        x.substr(12, 1)
      ].join('-')
    : false;


const google = x =>
  'https://www.google.de/search?q='.concat(x);


const hanzi = () =>
  String.fromCharCode(0x4E00 + Math.random() * (0x9FFF - 0x4E00 + 1));


const toClipboard = str => {
  const e           = document.createElement('textarea');
  e.value           = str;
  e.setAttribute('readonly', '');
  e.style.position  = 'absolute';
  e.style.left      = '-9999px';
  document.body.appendChild(e);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  e.select();
  document.execCommand('copy');
  document.body.removeChild(e);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};


const background = x => {
  const rgb = 'rgb('.concat(x, ')');
  $('body').css('background-color', rgb);
}


const focus = x => {
  $(x).val('').focus();
}
