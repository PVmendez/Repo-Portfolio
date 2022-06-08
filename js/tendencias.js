var MiniMasonry=function(t){return this._sizes=[],this._columns=[],this._container=null,this._count=null,this._width=0,this._resizeTimeout=null,this.conf={baseWidth:255,gutterX:null,gutterY:null,gutter:10,container:null,minify:!0,ultimateGutter:5,surroundingGutter:!0},this.init(t),this};MiniMasonry.prototype.init=function(t){for(var i in this.conf)null!=t[i]&&(this.conf[i]=t[i]);if(null!=this.conf.gutterX&&null!=this.conf.gutterY||(this.conf.gutterX=this.conf.gutterY=this.conf.gutter),this._gutterX=this.conf.gutterX,this._container=document.querySelector(this.conf.container),!this._container)throw new Error("Container not found or missing");window.addEventListener("resize",this.resizeThrottler.bind(this)),this.layout()},MiniMasonry.prototype.reset=function(){this._sizes=[],this._columns=[],this._count=null,this._width=this._container.clientWidth;var t=this.conf.baseWidth;this._width<t&&(this._width=t,this._container.style.minWidth=t+"px"),1==this.getCount()?(this.conf._gutterX=this.conf.gutterX,this.conf.gutterX=this.conf.ultimateGutter,this._count=1):this.conf.gutterX=this._gutterX},MiniMasonry.prototype.getCount=function(){return this.conf.surroundingGutter?Math.floor((this._width-this.conf.gutterX)/(this.conf.baseWidth+this.conf.gutterX)):Math.floor((this._width+this.conf.gutterX)/(this.conf.baseWidth+this.conf.gutterX))},MiniMasonry.prototype.computeWidth=function(){var t;return t=this.conf.surroundingGutter?(this._width-this.conf.gutterX)/this._count-this.conf.gutterX:(this._width+this.conf.gutterX)/this._count-this.conf.gutterX,t=Number.parseInt(t.toFixed(2))},MiniMasonry.prototype.layout=function(){if(this._container){this.reset(),null==this._count&&(this._count=this.getCount());for(var t=this.computeWidth(),i=0;i<this._count;i++)this._columns[i]=0;for(var n=this._container.querySelectorAll(this.conf.container+" > *"),s=0;s<n.length;s++)n[s].style.width=t+"px",this._sizes[s]=n[s].clientHeight;var o=this.conf.surroundingGutter?this.conf.gutterX:0;if(this._count>this._sizes.length){var e=this._sizes.length*(t+this.conf.gutterX)-this.conf.gutterX;o=(this._width-e)/2}for(var r=0;r<n.length;r++){var h=this.conf.minify?this.getShortest():this.getNextColumn(r),u=0;(this.conf.surroundingGutter||h!=this._columns.length)&&(u=this.conf.gutterX);var c=o+(t+u)*h,l=this._columns[h];n[r].style.transform="translate3d("+Math.round(c)+"px,"+Math.round(l)+"px,0)",this._columns[h]+=this._sizes[r]+this.conf.gutterY}this._container.style.height=this._columns[this.getLongest()]-this.conf.gutterY+"px"}else console.error("Container not found")},MiniMasonry.prototype.getNextColumn=function(t){return t%this._columns.length},MiniMasonry.prototype.getShortest=function(){for(var t=0,i=0;i<this._count;i++)this._columns[i]<this._columns[t]&&(t=i);return t},MiniMasonry.prototype.getLongest=function(){for(var t=0,i=0;i<this._count;i++)this._columns[i]>this._columns[t]&&(t=i);return t},MiniMasonry.prototype.resizeThrottler=function(){this._resizeTimeout||(this._resizeTimeout=setTimeout(function(){this._resizeTimeout=null,this._container.clientWidth!=this._width&&this.layout()}.bind(this),33))};

var journoPortfolio = (function () {

    const loaded = [];
    const inProgress = {};
    const blocks = [];
    var DOMContentLoaded = false

    function libName2URL(libName){
      switch(libName){
        case 'mapbox':
          return 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'
        case 'grecaptcha':
          return `https://www.google.com/recaptcha/api.js?render=${window.PORTFOLIO_CAPTCHA_PUBLIC_KEY}`
        case 'reframe':
          return 'https://assets.journoportfolio.com/public/js/reframe-2.min.js'
        case 'pdfobject':
          return 'https://assets.journoportfolio.com/public/js/pdfobject-201604172.min.js'
        case 'macy':
          return 'https://assets.journoportfolio.com/public/js/macy-1.0.0.js'
        case 'swiper':
          return 'https://assets.journoportfolio.com/public/js/swiper-6.4.11.min.js'
        case 'axios':
          return 'https://assets.journoportfolio.com/public/js/axios-0.21.1.min.js'
      }
    }

    function articleClick(id){
        return new Promise((resolve, reject) => {
            if(window.IS_OWNER){
                resolve()
                return
            }
            try {
                fetch('/_analytics/articles/'+id+'/').then(function(){
                    resolve()
                }).catch(function(){
                    resolve()
                })
            } catch {
                resolve()
            }
        })
    }

    function requireLibrary(libName){
        var promise = new Promise((resolve, reject) => {

            let url = libName2URL(libName);

            if(url){
              loadScript(libName, url, resolve)
            }
        })
        return promise;
    }

    function loadScript(libName, url, resolve){
        if(loaded.indexOf(libName) !== -1){
            return resolve();
        }
        if(libName in inProgress){
          inProgress[libName].push(resolve);
          return
        }else{
          inProgress[libName] = [resolve]
        }
        var script = document.createElement('script');
        script.onload = function(){
            loaded.push(libName)
            for(var i=0;i<inProgress[libName].length;i++){
                inProgress[libName][i]()
            }
            delete inProgress[libName];
        }
        script.src = url;
        document.head.appendChild(script);
    }

    function init(){
      document.addEventListener('DOMContentLoaded', function(){
          DOMContentLoaded = true

          document.querySelectorAll('.block').forEach(($block) => {
            if($block.dataset.definitionName in blocks){
              blocks[$block.dataset.definitionName].initialize($block);
            }
          })
      });
    }

    function reInitializeBlock($block){
      if($block.dataset.definitionName in blocks){
        blocks[$block.dataset.definitionName].initialize($block);
      }
    }

    function registerBlock(typeID, func){
      blocks[typeID] = func
    }

    return {
      reInitializeBlock: reInitializeBlock,
      requireLibrary: requireLibrary,
      articleClick: articleClick,
      registerBlock: registerBlock,
      init: init
    }
})();
journoPortfolio.registerBlock("PDF", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      

var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

if(iOSSafari){
  var $e = block.querySelector("object")
  $e.parentNode.insertAdjacentElement('beforebegin', $e.children[0])
  $e.parentNode.removeChild($e)
}

// var ratio = block.querySelector(".block-cv").dataset.ratio

// block.querySelectorAll('iframe, object').forEach(function($e){
//   // $e.style.height = ($e.offsetWidth * ratio) + 'px'
// })

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Subscribe Form", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      var $modal = block.querySelector('.content-modal')
if($modal){
  var $form = $modal;
}else{
  var $form = block;
}

function escPress (e) {
    if (e.key === "Escape") {
        closeModal()
    }
}

function closePress (e) {
    closeModal();
}

function clickBg (e) {
    if (e.target === this){
      closeModal()
    }
}

function closeModal () {
    $modal.classList.remove('open')
    document.removeEventListener('keyup', escPress);
}

function openModal () {
    document.body.appendChild($modal)
    $modal.classList.add('open')

    $modal.onclick = clickBg
    $modal.querySelector('.close').onclick = closePress
    document.addEventListener('keyup', escPress);
}

if(block.querySelector('.open-subscribe-form')){
  block.querySelector('.open-subscribe-form').onclick = function(){
    openModal()
  }
}

Promise.all([
  journoPortfolio.requireLibrary("grecaptcha"),
  journoPortfolio.requireLibrary("axios"),
]).then(function(){

  var loading = false
  if(!block.querySelector('form')){
    return
  }
  block.querySelector('form').onsubmit = function(e){
    e.preventDefault();

    if(loading){
      return
    }

    loading = true
    $form.querySelector('button').classList.add('saving')
    $form.querySelectorAll('input,textarea').forEach(function($el){
      $el.parentElement.classList.remove('error')
    })

    grecaptcha.ready(function() {
      grecaptcha.execute(window.PORTFOLIO_CAPTCHA_PUBLIC_KEY, {action: 'submit'}).then(function(token) {

        var data = {
          email: $form.querySelector('input[name=email]').value,
          name: $form.querySelector('input[name=name]').value,
          captcha_token: token
        }
        axios.post('/api/v1/subscribe/', data)
          .then(function(data) {
            var $form1 = $form.querySelector('form')
            var $success = $form.querySelector('.success-message')
            $success.style.height = $form1.offsetHeight + 'px'
            $success.style.width = $form1.offsetWidth + 'px'
            $success.style.display = 'block'
            $form1.remove()
          })
          .catch(function(error){
            if (error.response) {
              if(error.response.status === 400){
                errors = error.response.data;
                for(name in errors){
                  $form.querySelector('input[name='+name+']').parentElement.classList.add('error')
                  $form.querySelector('input[name='+name+']').parentElement.querySelector('.field__error').innerHTML = errors[name][0]
                }
                console.log(error.response.data)
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
          })
          .finally(function(){
            loading = false
            if($form.querySelector('button')){
              $form.querySelector('button').classList.remove('saving')
            }
          })
      })

    });
  }
});

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Blog Post Footer", (function () {
    const type = "blog-post";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      var loading = false;

Promise.all([
  journoPortfolio.requireLibrary("grecaptcha"),
  journoPortfolio.requireLibrary("axios"),
]).then(function(){

    var $modal = block.querySelector('.content-modal')

    if(block.querySelector('#add-comment')){
      block.querySelector('#add-comment').onclick = function(){
          openModal()
      }
    }

    function closeModal () {
        $modal.classList.remove('open')
        document.removeEventListener('keyup', escPress);
    }

    function escPress (e) {
        if (e.key === "Escape") {
            closeModal()
        }
    }

    function closePress (e) {
        closeModal();
    }

    function clickBg (e) {
        if (e.target === this){
          closeModal()
        }
    }

    function showGlobalError(errorMsg){
      $modal.querySelector('.error-global').innerText = errorMsg
      $modal.querySelector('.error-global').style.display = 'block'
    }

    function applyErrorToField(fieldName, errorMsg){
      var $field = block.querySelector('#field_'+fieldName)
      $field.classList.add('error')
      if($field.querySelector('.error-msg')){
        $field.querySelector('.error-msg').remove()
      }
      $field.children[1].insertAdjacentHTML( 'afterend', "<div class='error-msg'>"+errorMsg+"</div>");
    }

    function openModal () {
        document.body.appendChild($modal)
        $modal.classList.add('open')
        $modal.removeAttribute('hidden')

        $modal.onclick = clickBg
        $modal.querySelector('.close').onclick = closePress
        document.addEventListener('keyup', escPress);

        $modal.querySelector('#comment-form').onsubmit = function(e){
          e.preventDefault()

          loading = true
          $modal.querySelectorAll('input,textarea').forEach(function($el){
            $el.parentElement.classList.remove('error')
          })
          $modal.querySelector('button').classList.add('saving')

          grecaptcha.ready(function() {
            grecaptcha.execute(window.PORTFOLIO_CAPTCHA_PUBLIC_KEY, {action: 'submit'}).then(function(token) {

              var data = {
                name: $modal.querySelector('#comment_name').value,
                email: $modal.querySelector('#comment_email').value,
                content: $modal.querySelector('#comment_content').value,
                article: window.ARTICLE_ID,
                captcha_token: token
              }
              axios.post("/api/v1/comments/", data)
                .then(data => {
                  closeModal()
                  $modal.querySelector('#comment_name').value = ''
                  $modal.querySelector('#comment_email').value = ''
                  $modal.querySelector('#comment_content').value = ''
                  var comment = data.data
                  document.querySelector('.comments').insertAdjacentHTML('beforeend', `<div class="comment new" id="comment-${comment.id}"><small class="meta">Posted on ${comment.datetime} <a class="comment__permalink" href="${window.location.pathname}#comment-${comment.id}">Permalink</a></small><h3>${comment.name}</h3>${comment.content_display}</div>`)

                  document.querySelector(`#comment-${comment.id}`).scrollIntoView({
                        behavior: 'smooth'
                  });
                })
                .catch(error =>{
                  loading = false
                  if (error.response) {
                    if(error.response.status === 400){
                      errors = error.response.data;
                      for(name in errors){
                        $modal.querySelector('[name='+name+']').parentElement.classList.add('error')
                        $modal.querySelector('[name='+name+']').parentElement.querySelector('.field__error').innerHTML = errors[name][0]
                      }
                      console.log(error.response.data)
                    }
                  } else if (error.request) {
                    console.log(error.request);
                  } else {
                    console.log('Error', error.message);
                  }

                })
              })
          })
        }
    }

})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Navigation", (function () {
    const type = "navigation";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      function isOverflown(element) {
  return element.scrollWidth > element.clientWidth;
}

block.querySelectorAll('.navicon').forEach(function(item){
  item.onclick = function (){
      block.querySelector('.sidebar').classList.toggle("open");
      block.querySelector('.navicon').classList.toggle("open");
  };
})

block.querySelectorAll('.menu ul li a, .sidebar__inner a').forEach(function(item){
  item.onclick = function (e){
    var href = item.getAttribute("href")
    if(href.startsWith('/#')){
      e.preventDefault()
      var el = document.getElementById(href.replace('/#', ''))
      var y = el.getBoundingClientRect().top + window.pageYOffset - document.querySelector('.header').offsetHeight;

      window.scrollTo({top: y, behavior: 'smooth'});
      block.querySelector('.sidebar').classList.remove("open");
      block.querySelector('.navicon').classList.remove("open");
    }
  };
})

function setupMenu() {
  block.querySelector('.menu').classList.remove('force-navicon')
  block.querySelectorAll('.menu ul > li.hidden').forEach((item)=>{
    item.classList.remove('hidden')
  })
  if(block.querySelector('.menu > ul')){
    if(isOverflown(block.querySelector('.menu > ul'))){
      block.querySelector('.menu').classList.add('force-navicon')
      while(isOverflown(block.querySelector('.menu > ul')) && block.querySelectorAll('.menu ul > li:not(.hidden)').length > 0){
        var links = block.querySelectorAll('.menu ul > li:not(.hidden)')
        links[links.length-1].classList.add('hidden')
      }
    }
  }
}

function setupTransparency () {
  if(block.querySelector('.header--transparent')){
    if(window.scrollY > 50){
      block.querySelector('.header--transparent').classList.remove('transparent')
    }else{
      block.querySelector('.header--transparent').classList.add('transparent')
    }
  }
}


window.onresize = setupMenu
setupMenu()

window.onscroll = setupTransparency
setupTransparency()


    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Media Embed", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      
if(window.instgrm){
  window.instgrm.Embeds.process()
}
if(window.twttr){
  window.twttr.widgets.load()
}
if(window.FB){
  FB.XFBML.parse()
}

journoPortfolio.requireLibrary("reframe").then(function(){
  if(block.querySelector('iframe')){
    var newHeight = block.offsetWidth * (block.querySelector('iframe').height/block.querySelector('iframe').width)
    block.querySelector('iframe').style.width = '100%'
    block.querySelector('iframe').style.height = newHeight + 'px'
    reframe(block.querySelector('iframe'))
  }
})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Slideshow", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      journoPortfolio.requireLibrary('swiper').then(function(){
  var $slider = block.querySelector('.block-slider')
  if(block.querySelectorAll('.swiper-container').length){
    var autoplay = false;
    if($slider.hasAttribute('autoplay')){
      autoplay = {
        delay: Number($slider.dataset.autoplayDelay),
        disableOnInteraction: true,
      }
    }
    var spaceBetween = 30
    if($slider.dataset.spaceBetween === "none"){
      spaceBetween = 0
    }
    if($slider.dataset.spaceBetween === "small"){
      spaceBetween = 15
    }
    if($slider.dataset.spaceBetween === "medium"){
      spaceBetween = 30
    }
    if($slider.dataset.spaceBetween === "large"){
      spaceBetween = 50
    }
    var mySwiper = new Swiper('#block-'+block.dataset.id+' .swiper-container', {
        direction: 'horizontal',
        loop: $slider.hasAttribute('loop'),
        autoHeight: true,
        autoplay: autoplay,
        spaceBetween: spaceBetween,
        slidesPerView: Number($slider.dataset.slidesPerView),
        paginationClickable: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });
  }
})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Gallery", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      

var $modal = block.querySelector('.content-modal');

function reloadMacy(){
  if(document.querySelector(`#block-${block.dataset.id} .gallery-item__wrapper--nocrop`)){
    var width = document.querySelector(`#block-${block.dataset.id} .gallery-item__wrapper--nocrop`).offsetWidth / Number(block.children[0].dataset.columns);
    width = Math.max(width-30, 180)
    new MiniMasonry({
      baseWidth: width,
      gutter: 0,
      container: `#block-${block.dataset.id} .gallery-item__wrapper--nocrop`,
      surroundingGutter: false,
    })
  }

}

if(block.querySelector('.gallery-item__wrapper--nocrop')){
  reloadMacy()
  setTimeout(function(){
    reloadMacy()
  }, 1000)
}

block.querySelectorAll('.gallery-item__img').forEach(function(item){

  item.onclick = function () {
    var $root = item.parentElement;
    var $current = item.parentElement;

    if(!$modal){
      return
    }

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'


    function sliderSlideLeft(){
      var $prev = $current.previousElementSibling;
      if(!$prev){
        $prev = $root.parentElement.children[$root.parentElement.children.length-1]
      }
      $modal.querySelector('img').setAttribute('src', $prev.dataset.src)
      $modal.querySelector('.caption').innerText = $prev.dataset.caption
      $current = $prev;
    }

    function sliderSlideRight(){
      var $next = $current.nextElementSibling;
      if(!$next){
        $next = $root.parentElement.children[0]
      }
      $modal.querySelector('img').setAttribute('src', $next.dataset.src)
      $modal.querySelector('.caption').innerText = $next.dataset.caption
      $current = $next;
    }

    if($modal.querySelectorAll('.gallery-modal__leftarrow').length===0){
      $modal.insertAdjacentHTML('beforeend', '<a class="gallery-modal__leftarrow">&#x2190;</a>')
      $modal.insertAdjacentHTML('beforeend', '<a class="gallery-modal__rightarrow">&#x2192;</a>')
      $modal.insertAdjacentHTML('beforeend', '<div class="gallery-modal__close">Close <span>âœ•</span></div>')
    }

    document.body.appendChild($modal);
    $modal.classList.add('open')
    $modal.removeAttribute('hidden')

    $modal.querySelector('img').setAttribute('src', $root.dataset.src);
    $modal.querySelector('.caption').innerText = $root.dataset.caption
    $modal.querySelector('.gallery-modal__close').onclick = sliderClose
    $modal.querySelector('.gallery-modal__leftarrow').onclick = sliderSlideLeft
    $modal.querySelector('.gallery-modal__rightarrow').onclick = sliderSlideRight

    function sliderClose(){
      $modal.querySelector('.gallery-modal__close').onclick = null
      $modal.classList.remove('open');
      document.onkeyup = null
      document.body.style.overflow = 'initial'
      document.documentElement.style.overflow = 'initial'
    }

    document.onkeyup = function(event) {
         switch (event.key) {
           case "Left":
           case "ArrowLeft":
             sliderSlideLeft()
             break;
           case "Right":
           case "ArrowRight":
             sliderSlideRight()
             break;
           case "Esc":
           case "Escape":
             sliderClose()
             break;
         }
    }

  }

})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Blog Post", (function () {
    const type = "blog-post";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      var loading = false;

Promise.all([
  journoPortfolio.requireLibrary("grecaptcha"),
  journoPortfolio.requireLibrary("axios"),
]).then(function(){

    var $modal = block.querySelector('.content-modal')

    if(block.querySelector('#add-comment')){
      block.querySelector('#add-comment').onclick = function(){
          openModal()
      }
    }

    function closeModal () {
        $modal.classList.remove('open')
        document.removeEventListener('keyup', escPress);
    }

    function escPress (e) {
        if (e.key === "Escape") {
            closeModal()
        }
    }

    function closePress (e) {
        closeModal();
    }

    function clickBg (e) {
        if (e.target === this){
          closeModal()
        }
    }

    function showGlobalError(errorMsg){
      $modal.querySelector('.error-global').innerText = errorMsg
      $modal.querySelector('.error-global').style.display = 'block'
    }

    function applyErrorToField(fieldName, errorMsg){
      var $field = block.querySelector('#field_'+fieldName)
      $field.classList.add('error')
      if($field.querySelector('.error-msg')){
        $field.querySelector('.error-msg').remove()
      }
      $field.children[1].insertAdjacentHTML( 'afterend', "<div class='error-msg'>"+errorMsg+"</div>");
    }

    function openModal () {
        document.body.appendChild($modal)
        $modal.classList.add('open')
        $modal.removeAttribute('hidden')

        $modal.onclick = clickBg
        $modal.querySelector('.close').onclick = closePress
        document.addEventListener('keyup', escPress);

        $modal.querySelector('#comment-form').onsubmit = function(e){
          e.preventDefault()

          loading = true
          $modal.querySelectorAll('input,textarea').forEach(function($el){
            $el.parentElement.classList.remove('error')
          })
          $modal.querySelector('button').classList.add('saving')

          grecaptcha.ready(function() {
            grecaptcha.execute(window.PORTFOLIO_CAPTCHA_PUBLIC_KEY, {action: 'submit'}).then(function(token) {

              var data = {
                name: $modal.querySelector('#comment_name').value,
                email: $modal.querySelector('#comment_email').value,
                content: $modal.querySelector('#comment_content').value,
                article: window.ARTICLE_ID,
                captcha_token: token
              }
              axios.post("/api/v1/comments/", data)
                .then(data => {
                  closeModal()
                  $modal.querySelector('#comment_name').value = ''
                  $modal.querySelector('#comment_email').value = ''
                  $modal.querySelector('#comment_content').value = ''
                  var comment = data.data
                  document.querySelector('.comments').insertAdjacentHTML('beforeend', `<div class="comment new" id="comment-${comment.id}"><small class="meta">Posted on ${comment.datetime} <a class="comment__permalink" href="${window.location.pathname}#comment-${comment.id}">Permalink</a></small><h3>${comment.name}</h3>${comment.content_display}</div>`)

                  document.querySelector(`#comment-${comment.id}`).scrollIntoView({
                        behavior: 'smooth'
                  });
                })
                .catch(error =>{
                  loading = false
                  if (error.response) {
                    if(error.response.status === 400){
                      errors = error.response.data;
                      for(name in errors){
                        $modal.querySelector('[name='+name+']').parentElement.classList.add('error')
                        $modal.querySelector('[name='+name+']').parentElement.querySelector('.field__error').innerHTML = errors[name][0]
                      }
                      console.log(error.response.data)
                    }
                  } else if (error.request) {
                    console.log(error.request);
                  } else {
                    console.log('Error', error.message);
                  }

                })
              })
          })
        }
    }

})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Map", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      journoPortfolio.requireLibrary("mapbox").then(function(){
  var map = block.querySelector('.map-wrapper');

  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaGNhcmxsZXdpcyIsImEiOiJja2w4Y3Mxcm4wb2tlMnBucDQwZWVtNWY3In0.a-z6wpUPJ-tvhwZWREoLuQ';
  var map = new mapboxgl.Map({
  container: map.querySelector('.map'),
  center: [parseFloat(map.dataset.lng), parseFloat(map.dataset.lat)],
  style: 'mapbox://styles/mapbox/'+map.dataset.style,
  zoom: Number(map.dataset.zoom),
  });

})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Video", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      journoPortfolio.requireLibrary("reframe").then(function(){
  if(block.querySelector('iframe')){
    reframe(block.querySelector('iframe'))
  }
});

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Articles", (function () {
    const type = "article";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      
var $block = block;
var $articleBlock = $block.children[0];
var $autoloader = $block.querySelector('.autoloader')
var $inputSearch = $block.querySelector('input.search')
var $selectPublication = $block.querySelector('.publication-select')
var $selectTags = $block.querySelector('.tags-select')
var $selectOrder = $block.querySelector('.order-select')
var loading = false

var $masonry = $block.querySelector('.masonry')
var $modal = $block.querySelector('.content-modal')
var loadingMacy = false

if($block.querySelector('.filters-show')){
  $block.querySelector('.filters-show').onclick = function(){
    $block.querySelector('.filters-show').nextElementSibling.classList.toggle('open')
  }
}

var GUTTERS = {
  "none": 0,
  "small": 15,
  "medium": 30,
  "large": 50,
}

function COLUMNS_TARGET(cols){
  if(window.innerWidth < 600){
    return $articleBlock.offsetWidth -100
  }
  var width = $articleBlock.offsetWidth -((Number(cols)-1)*GUTTERS[$articleBlock.dataset.gutter])
  return Math.max((width  / Number(cols)), 200)
}

function bindArticles(){
    $articleBlock.querySelectorAll('article').forEach(function ($article) {
        if($article.querySelector('.article__inner')){
            $article.querySelector('.article__inner').onclick = function (event) {

                journoPortfolio.articleClick($article.dataset.id).then(function(){
                    // do nothing
                })

                if($article.classList.contains('article--modal')){
                    event.preventDefault()
                    openModal($article.dataset.id)
                    return false;
                }
            }
        }
    })
}

function reloadMacy(){
  if(!$masonry){
    bindArticles()
    return
  }
  $masonry.classList.remove('animate')
  if(!window.MASONRY){
    window.MASONRY = {}
  }

  if(document.querySelector(`#block-${block.dataset.id} .masonry`)){
    window.MASONRY[Number(block.dataset.id)] = new MiniMasonry({
      baseWidth: COLUMNS_TARGET($articleBlock.dataset.columns),
      container: `#block-${block.dataset.id} .masonry`,
      surroundingGutter: false,
      gutter: GUTTERS[$articleBlock.dataset.gutter],
    })

    if(block.querySelectorAll('.dragging').length > 0){
      $masonry.classList.add('animate')
    }else{
      setTimeout(function(){
        $masonry.classList.add('animate')
      }, 500)
    }
  }
  bindArticles()
}

function autoLoaderClick(e){
  loadNextPage();
}

function loadNextPage(){
  $autoloader.innerText = 'Loading more articles...'

  loadArticles($articleBlock.querySelectorAll('article').length)
}


function escPress (e) {
    if (e.key === "Escape") {
        closeModal()
    }
}

function closePress (e) {
    closeModal();
}

function clickBg (e) {
    if (e.target === this){
      closeModal()
    }
}

function closeModal () {
    document.documentElement.classList.remove('modal-open');
    $modal.querySelector('.content-modal__content').innerHTML = ''
    $modal.classList.remove('open')
    document.removeEventListener('keyup', escPress);
}

function openModal (article_id) {
    document.body.appendChild($modal);

    document.documentElement.classList.add('modal-open');
    $modal.querySelector('.loading').style.display = 'block'
    $modal.classList.add('open')
    $modal.removeAttribute('hidden')

    fetch("/api/v1/articles/"+article_id+"/?template")
      .then(response => response.text())
      .then(data => {

        $modal.querySelector('.content-modal__content').innerHTML = data
        $modal.querySelector('.loading').style.display = 'none'

        if($modal.querySelector('script')){
          var script = document.createElement('script');
          script.onload = function(){}
          script.src = $modal.querySelector('script').src;
          document.head.appendChild(script);
        }

        if(
          $modal.querySelector('iframe') &&
          !$modal.querySelector('iframe[data-nofitvids]') &&
          $modal.querySelector('iframe').src.indexOf('.soundcloud.com') === -1 &&
          $modal.querySelector('iframe').src.indexOf('.reverbnation.com') === -1 &&
          $modal.querySelector('iframe').src.indexOf('.instagram.com') === -1 &&
          $modal.querySelector('iframe').src.indexOf('.facebook.com') === -1 &&
          $modal.querySelector('iframe').src.indexOf('.twitter.com') === -1
        ){
          journoPortfolio.requireLibrary("reframe").then(function(){
            reframe($modal.querySelector('iframe'), 80)
          })
        }
      })

    $modal.onclick = clickBg
    $modal.querySelector('.close').onclick = closePress
    document.addEventListener('keyup', escPress);
}

function loadArticles(start_from) {
  if(loading){
    return
  }
  loading = true;

  var searchVal = ''
  var publicationVal = 'all'
  var tagsVal = 'all'
  var orderVal = $articleBlock.dataset.defaultOrder
  
  if(typeof start_from !== "number"){
    start_from = 0
  }

  if($inputSearch){
    searchVal = $inputSearch.value
  }
  if($selectOrder){
    orderVal = $selectOrder.value
  }
  if($selectPublication){
    publicationVal = $selectPublication.value
  }
  if($selectTags){
    tagsVal = $selectTags.value
  }

  fetch("/api/v1/articles/?block="+block.dataset.id+"&order="+orderVal+"&publication="+publicationVal+"&tag="+tagsVal+"&start="+start_from+"&search="+searchVal)
    .then(response => response.text())
    .then(data => {
          // this.$el.removeClass('loading')
          loading = false;

          var countBefore = block.querySelectorAll('.articles__wrapper article').length

          if(start_from === 0){
            countBefore = 0
            block.querySelector('.articles__wrapper').innerHTML = data;
          }else{
            block.querySelector('.articles__wrapper').insertAdjacentHTML('beforeend', data)
          }

          var countAfter = block.querySelectorAll('.articles__wrapper article').length
          if(data == '' || (countAfter-countBefore) < 12 ){
              $autoloader.style.display = 'none';
          }else{
              $autoloader.style.display = 'block';
              $autoloader.innerText = 'Load more articles'
          }

          reloadMacy();

          block.dispatchEvent(new Event('ArticleAPILoad'))

    });
}

if ("IntersectionObserver" in window) {
  if(!window.loadMoreObserver){
    window.loadMoreObserver = {}
  }else{
    if($block.dataset.id in window.loadMoreObserver){
      window.loadMoreObserver[$block.dataset.id].disconnect()
    }
  }

  window.loadMoreObserver[$block.dataset.id] = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        autoLoaderClick()
      }
    });
  }, {rootMargin: "0px 0px 300px 0px"});
}

if($autoloader){
  $autoloader.onclick = autoLoaderClick

  // If the last block in the last section load on page scroll
  if ($block.nextElementSibling === null){

    if ($block.parentNode.parentNode.parentNode.nextElementSibling === null){
      if (!$block.parentNode.parentNode.parentNode.parentNode.classList.contains('widget-render')){


        if ("IntersectionObserver" in window) {
          window.loadMoreObserver[$block.dataset.id].unobserve($autoloader);
          window.loadMoreObserver[$block.dataset.id].observe($autoloader);
        }
      }
    }
  }
}

if($inputSearch){
  $inputSearch.onblur = loadArticles
  $inputSearch.onkeyup = function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      loadArticles()
    }
  }
}

if($selectOrder){
  $selectOrder.onchange =  loadArticles
}


if($selectTags){
  $selectTags.onchange =  loadArticles

  if(!isNaN($block.dataset.id)){
    fetch("/api/v1/tags/?block="+$block.dataset.id)
    .then(response => response.json())
    .then(data => {
        $selectTags.innerHTML = '<option value="all" selected>All Tags</option>'
        for(var i=0; i < data.length; i++){
            var tag = data[i];
            var option = document.createElement("option");
            option.text = tag;
            option.value = tag;
            $selectTags.appendChild(option);
        }
    });
  }
}

if($selectPublication){
  $selectPublication.onchange =  loadArticles

  if(!isNaN($block.dataset.id)){
    fetch("/api/v1/publications/?block="+$block.dataset.id)
    .then(response => response.json())
    .then(data => {
        $selectPublication.innerHTML = '<option value="all" selected>All Publications</option>'
        for(var i=0; i < data.length; i++){
            var pub = data[i];
            var option = document.createElement("option");
            option.text = pub.name;
            option.value = pub.id;
            $selectPublication.appendChild(option);
        }
    });
  }
}

loadingMacy = true
reloadMacy();
setTimeout(function(){
  reloadMacy();
  loadingMacy = false
}, 500)

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Navigation Sidebar", (function () {
    const type = "navigation";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      
block.querySelectorAll('.menu ul li a').forEach(function(item){
  item.onclick = function (e){
    var href = item.getAttribute("href")
    if(href.startsWith('/#')){
      e.preventDefault()
      var el = document.getElementById(href.replace('/#', ''))
      var y = el.getBoundingClientRect().top + window.pageYOffset

      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };
})

    }

    return {
      initialize: initialize,
    }
})());

journoPortfolio.registerBlock("Contact Form", (function () {
    const type = "generic";

    function initialize (block) {
      executeBlockCode(block);
    }

    function executeBlockCode (block) {
      var $modal = block.querySelector('.content-modal')
if($modal){
  var $form = $modal;
}else{
  var $form = block;
}

function escPress (e) {
    if (e.key === "Escape") {
        closeModal()
    }
}

function closePress (e) {
    closeModal();
}

function clickBg (e) {
    if (e.target === this){
      closeModal()
    }
}

function closeModal () {
    $modal.classList.remove('open')
    document.removeEventListener('keyup', escPress);
}

function openModal () {
    document.body.appendChild($modal)
    $modal.classList.add('open')
    $modal.removeAttribute('hidden')


    $modal.onclick = clickBg
    $modal.querySelector('.close').onclick = closePress
    document.addEventListener('keyup', escPress);
}

if(block.querySelector('.open-contact-form')){
  block.querySelector('.open-contact-form').onclick = function(){
    openModal()
  }
}

Promise.all([
  journoPortfolio.requireLibrary("grecaptcha"),
  journoPortfolio.requireLibrary("axios"),
]).then(function(){

  var loading = false
  if(!block.querySelector('form')){
    return
  }
  block.querySelector('form').onsubmit = function(e){
    e.preventDefault();

    if(loading){
      return
    }

    loading = true
    $form.querySelectorAll('input,textarea').forEach(function($el){
      $el.parentElement.classList.remove('error')
    })
    $form.querySelector('button').classList.add('saving')

    grecaptcha.ready(function() {
      grecaptcha.execute(window.PORTFOLIO_CAPTCHA_PUBLIC_KEY, {action: 'submit'}).then(function(token) {

        var data = {
          email: $form.querySelector('input[name=email]').value,
          name: $form.querySelector('input[name=name]').value,
          message: $form.querySelector('textarea[name=message]').value,
          captcha_token: token
        }
        axios.post('/api/v1/message/', data)
          .then(function(data){
            var $form1 = $form.querySelector('form')
            var $success = $form.querySelector('.success-message')
            $success.style.height = $form1.offsetHeight + 'px'
            $success.style.width = $form1.offsetWidth + 'px'
            $success.style.display = 'block'
            $form1.remove()
          })
          .catch(function(error){
            if (error.response) {
              if(error.response.status === 400){
                errors = error.response.data;
                for(name in errors){
                  $form.querySelector('[name='+name+']').parentElement.classList.add('error')
                  $form.querySelector('[name='+name+']').parentElement.querySelector('.field__error').innerHTML = errors[name][0]
                }
                console.log(error.response.data)
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
          })
          .finally(function(){
            loading = false
            if($form.querySelector('button')){
              $form.querySelector('button').classList.remove('saving')
            }
          })
      })

    });
  }
});

    }

    return {
      initialize: initialize,
    }
})());
journoPortfolio.init();