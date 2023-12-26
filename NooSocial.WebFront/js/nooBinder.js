
export const nooBinder = {

  verbose: true,

  log(msg) {

    if (this.verbose) console.log(msg);
  },

  initialize() {

    console.log('nooBinder.initialize()');

    let body = $('body')[0];

    this.bind(body);

    this.watchDOM(body, (boundObj) => {

      this.log('BOUND STUFF!', boundObj);

      if (boundObj.addedNodes) {

        for (var n = 0; n < boundObj.addedNodes.length; n++) {

          this.bind(boundObj.addedNodes[n]);
        }
      }
    });
  },

  bind(element) {

    element = $(element);
  
    var elsToUpdate = element.find(`[${ ATTR_NOO_BIND_TO }]`);
  
    this.log(`BIND ${ element[0].tagName }> ${ elsToUpdate.length } elements`);

    //elsToUpdate.splice(0, 0, element);

    elsToUpdate.each((i, el) => {
  
      el = $(el);
  
      el.addClass(STATE_CONTENT_LOADING);

      var bindMy = el.attr(ATTR_NOO_BIND_MY);
      var bindVal = el.attr(ATTR_NOO_BIND_TO);
      var contBefore =  el.attr(ATTR_NOO_BIND_PREPEND);
      var contAfter =  el.attr(ATTR_NOO_BIND_APPEND);
  
      if (!bindVal) bindVal = '';

      this.log(`BIND ${ element[0].tagName } ${ el[0].tagName } ${ bindMy ? bindMy : '' } => ${ bindVal }`);

      if (bindVal.includes('.')) {

        let bindStuff = bindVal.split('.');

        if (bindStuff[0] == 'user') {

          // bind to user data
          bindVal = nooAuthData.UserData[bindVal.split('.')[1]];

        } 
        
        if (bindStuff[0] == 'context') {
          
          // bind to context (parent) stuff
          var contextData = el.closest(`[${ ATTR_NOO_BIND_CONTEXT }]`)
        }
        
        this.bindSet(el, bindMy, bindVal);

      } else {

        //bind to data store stuff, possibly async
        bindVal = nooDataStore.get(bindVal, () => {

          this.bindSet(el, bindMy, bindVal);
        });
      }
      
    });
  },

  bindSet(element, bindMy, bindVal) {

    if (bindMy == null || bindMy == '' || bindMy == 'html') {
      element.html(bindVal);
    }

    this.log(`BINDSET ${ element[0].tagName } ${ bindMy ? bindMy : '(empty)' } ${ bindVal } `);

    if (bindMy == 'text') element.text(bindVal);
    
    if (bindMy == 'children') this.bind(element);
    
    element.removeClass(STATE_CONTENT_LOADING);
  },

  watchDOM(obj, callback) {

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if ( !obj || obj.nodeType !== 1 ) return;

    if (MutationObserver) {
      
      var obs = new MutationObserver(function(mutations, observer){
        callback(mutations);
      });

      obs.observe(obj, { childList:true, subtree:true });

    } else if(window.addEventListener) {

      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
}
