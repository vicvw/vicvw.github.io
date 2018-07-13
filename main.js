Mousetrap.bind('space', () => {
  $('#isbn-in').focus().val('');
}, 'keyup');


$('#isbn-in').on('input', () => {
  const isbnIn  = $('#isbn-in').val();
  const isbnOut = $('#isbn-out');
  const isbn    = toIsbn(isbnIn);

  if (isbn) {
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
  }
});


const toIsbn = x => {
  if (/^\d{13}$/.test(x)) {
    const a = x.substr( 0, 3),
          b = x.substr( 3, 1),
          c = x.substr( 4, 3),
          d = x.substr( 7, 5),
          e = x.substr(12, 1);

    return [a, b, c, d, e].join('-');
    return a.concat('-', b);
  } else {
    return false;
  }
}


const google = x => {
    return 'https://www.google.de/search?q='.concat(x);
}


const hanzi = () => {
  return String.fromCharCode(0x4E00 + Math.random() * (0x9FFF - 0x4E00 + 1));
}


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
