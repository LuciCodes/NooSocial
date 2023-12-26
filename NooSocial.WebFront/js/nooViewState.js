
export const nooViewState = {

  // Takes either param, and they can be one string or array
  setViewState(stateAdd, stateRemove) {

    let body = $('body');

    if (stateAdd && stateAdd != '')
    {
      if (!Array.isArray(stateAdd)) {
        if (stateAdd.includes(',')) {
          // string as list: a, b, c

          stateAdd = stateAdd.split(',');

        } else {
          //only string
          stateAdd = [stateAdd];
        }
      }

      stateAdd.forEach((element) => body.addClass('state-' + element));
    }

    if (stateRemove && stateRemove != '')
    {
      if (!Array.isArray(stateRemove))
        stateRemove = [stateRemove];

      stateRemove.forEach((element) => body.removeClass('state-' + element));
    } 
  },

  toggleViewState(viewState) {

    if (this.hasViewState(viewState)) {

      this.setViewStateAndSave('', viewState);

    } else {

      if (viewState == 'main-tl-collapsed') {

        this.setAnimViewStateAndSave(viewState, 1, 200);

      } else {

        this.setViewStateAndSave(viewState);
      }
    }
  },

  toggleViewStateInContext(eventObj, context, viewState) {

    var contextObj = $(eventObj.target).closest(context);

    if (contextObj.length > 0) {

      var hasState = contextObj.hasClass('state-' + viewState);

      if (hasState) {

        contextObj.removeClass('state-' + viewState);

      } else {

        contextObj.addClass('state-' + viewState);
      }
    }

    eventObj.cancelBubble = true;
  },

  toggleViewStateInContextLater(eventObj, context, viewState, ms) {

    if (!ms || ms == 0) ms = 50;

    window.setTimeout(() => {

      this.toggleViewStateInContext(eventObj, context, viewState);
      
    }, 50);
  },

  setAnimViewStateAndSave(stateAdd, steps, stepDuration, debugStopAt) {

    if (!stepDuration || isNaN(stepDuration)) 
      stepDuration = 100;  //defaults 100ms
    
    for(let s = 0; s < steps; s++) {

      if (debugStopAt && debugStopAt == s) break;

      window.setTimeout(() => {
        if (s == (steps - 1)) {
          // last item
          
          //clear anim frames...
          for(let c = 0; c < steps; c++) {
            this.setViewState('', stateAdd + '-frame-' + (c + 1)); 
          }

          this.setViewState(stateAdd);

        } else {

          this.setViewState(stateAdd + '-frame-' + (s + 1));
        }
      }, (stepDuration * s));
    }
  },

  setViewStateAndSave(stateAdd, stateRemove) {

    this.setViewState(stateAdd, stateRemove);

    let vs = localStorage.getItem('nooViewState') || '';

    if (stateAdd && stateAdd != '') {

      if (vs != '') vs = ',' + vs;

      localStorage.setItem('nooViewState', stateAdd + vs);

    } else {

      localStorage.removeItem('nooViewState');
    }
  },

  hasViewState(state) {

    return $('body').hasClass('state-' + state);
  },

  hasViewState$(jQueryObj, state) {

    return jQueryObj.hasClass('state-' + state);
  },

  toggleReplyToPost(event) {

    var post = $(event.target).closest('.tl-post');
    var replyForm = post.closest('.timeline').find('.tl-post-reply');
    
    var isOneOpened = (post.closest('.timeline').find('.state-post-reply-expanded').length > 0);

    if (this.hasViewState$(post, 'post-reply-expanded')) {

      //we were expanded, close...
      this.toggleViewStateInContext(event, '.tl-post', 'post-reply-expanded');

      window.setTimeout(() => {
        replyForm.hide();
      }, 200);

    } else {

      // we were contracted...
      nooBinder.bind(replyForm);

      if (isOneOpened) {

        //if one opened, it must close then
        post.closest('.timeline')
          .find('.state-post-reply-expanded')
          .removeClass('state-post-reply-expanded');

        window.setTimeout(() => {

          //moves and opens
          if (!post.next().is('.tl-post-reply')) 
            post.after(replyForm);

          this.toggleViewStateInContextLater(event, '.tl-post', 'post-reply-expanded');

        }, 200);  //for animation to do its thing

      } else {

        replyForm.show();

        //moves and opens
        if (!post.next().is('.tl-post-reply')) {

          post.after(replyForm);

        }

        this.toggleViewStateInContextLater(event, '.tl-post', 'post-reply-expanded');
      }    
    }
  }
}
