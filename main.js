Mousetrap.bind('space', () => {
  focus('#ireru');
}, 'keyup');


$('#ireru').on('input', () => {
  const input   = $('#ireru').val();
  const isbnOut = $('#isbn-out');
  const r       = {
      isbn:   /^\d{13}$/,
      jidai:  /^([mtsh]?)(\d{1,3})$/
    }

  if (r.isbn.test(input)) {
    const isbn = toIsbn(input);

    toClipboard(isbn);
    focus('#ireru');
    isbnOut.text(isbn);
    isbnOut.attr('href', google('ean '.concat(input)));
    return;
  }
  else if (r.jidai.test(input)) {
    const jidaiK = $('#jidai-k');
    const jidaiR = $('#jidai-r');
    const jidaiY = $('#jidai-y');

    const match = r.jidai.exec(input);
    const gou   = match[1] ? match[1] : 'mg';
    const nen   = match[2];

    const [kj, rj, ad] = jidai(gou, nen);

    jidaiK.text(kj);
    jidaiR.text(rj);
    jidaiY.text(ad);
  }

  const hz = hanzi();
  isbnOut.text(hz);
  isbnOut.attr('href', google(hz));
});


$('#ireru').keyup(e => {
  if (e.keyCode === 13) {
    toClipboard($('#isbn-out').text());
    focus('#ireru');
  } else if (e.keyCode === 16) {
    background($('#ireru').val());
  }
});


[$('#jidai-k'), $('#jidai-r'), $('#jidai-y')].forEach(x => {
  x.on('click', () => {
    toClipboard(x.text());
  })
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


const jidai = (g, nen) => {
  const jd =
    { m:  ['明治', 'Meiji',  1868],
      t:  ['大正', 'Taishō', 1912],
      s:  ['昭和', 'Shōwa',  1926],
      h:  ['平成', 'Heisei', 1989],
      mg: ['民國', 'Minguo', 1912]
    }
  const [gou, gouR, ad] = jd[g];
  const AD = (ad - 1) + parseInt(nen);

  return [ gou.concat((g === 'mg') ? toKJ(nen)[0] : nen,
                      '年'),
           gouR.concat(' ',
                       (g === 'mg') ? toKJ(nen)[1] : nen,
                       ' ',
                       (g === 'mg') ? 'nian' : 'nen'),
           AD
         ];
};


const toKJ = s => {
  const digit = [
    ['零', 'ling'],
    ['一', 'yi'],
    ['二', 'er'],
    ['三', 'san'],
    ['四', 'si'],
    ['五', 'wu'],
    ['六', 'liu'],
    ['七', 'qi'],
    ['八', 'ba'],
    ['九', 'jiu']];

  const arr = s.split('');
  const k = arr.map(x => digit[parseInt(x)][0]).join('');
  const r = arr.map(x => digit[parseInt(x)][1]).join(' ');

  return [k, r];
};


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
