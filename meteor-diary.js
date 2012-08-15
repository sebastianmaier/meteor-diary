Messages = new Meteor.Collection("messages");

// ID selected Message
Session.set('message_id', null);

if (Meteor.is_client) {

  Meteor.startup(function () {
    $("#new-message").wysihtml5();
  });  

  ////////// Helpers for in-place editing //////////

  // Returns an event_map key for attaching "ok/cancel" events to
  // a text input (given by selector)
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };

  // Creates an event handler for interpreting "escape", "return", and "blur"
  // on a text field and calling "ok" or "cancel" callbacks.
  var make_okcancel_handler = function (options) {
    var ok = options.ok || function () {};
    var cancel = options.cancel || function () {};

    return function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  };

  // Finds a text input in the DOM by id and focuses it.
  var focus_field_by_id = function (id) {
    var input = document.getElementById(id);
    if (input) {
      input.focus();
      input.select();
    }
  };  

///////////// Messages ////////////////////
Template.messages.events = {};

Template.message_info.events = {
  'click .delete': function () {
    Messages.remove(this._id);
  },
  'click #tell-message': function () {
      Messages.insert({
        message: message,
        created_at: new Date()
      });
      evt.target.value = '';
  },
  'click .more': function () {
    Session.set('message_id', this._id);
    Meteor.flush();
    $("#moreModal").modal('show');
  },
  'click .rate': function () {
    Messages.update(this._id, {$inc: {rate: 1}});
  }
}



  Template.messages.greeting = function () {
    return "Welcome to try-meteor.";
  };

  Template.messages.messages_count = function () {
    return Messages.find({}).count();
  };


  Template.messages.messages = function() {
    return Messages.find({}, {sort: {created_at: -1}});
  }

  Template.modal.message = function() {
    var msg;
    if(Session.get('message_id')){
      msg = Messages.findOne(Session.get('message_id')).message
    }
    return msg;
  }

  Template.message_info.day_is = function (date) {
    return (new Date(date)).getDate();
  }
  Template.message_info.truncate = function (message) {
    var truncated_message = jQuery.truncate(message, {
              length: 200,
              words: true
            });
    return truncated_message == message ? false : truncated_message
  }
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}