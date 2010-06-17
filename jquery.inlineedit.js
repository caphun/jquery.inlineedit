/*
 * jQuery inlineEdit
 *
 * Copyright (c) 2009 Ca-Phun Ung <caphun at yelotofu dot com>
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 *
 * http://github.com/caphun/jquery.inlineedit/
 *
 * Inline (in-place) editing.
 */

(function($) {

// cached values
var namespace = '.inlineedit',
    placeholderClass = 'inlineEdit-placeholder';

// define inlineEdit method
$.extend( $.fn, {
    inlineEdit: function( options ) {
        var self = this;

        return this

            .live( ['click','mouseenter','mouseleave'].join(namespace+' '), function( event ) {
                
                var widget = ( $.inlineEdit.initialised( this ) === false ) 
                    ? new $.inlineEdit( this, options )
                    : widget = $( this ).data( 'widget' + namespace ),
                    unmutated = $( event.target ).is( self.selector );

                    switch ( event.type ) {
                        case 'click':
                            if ( unmutated ) {
                                widget.init();
                            } else {
                                widget.mutate();
                            }
                            break;

                        case 'mouseover':
                        case 'mouseout':
                            if ( unmutated ) {
                                widget.changeState( event );
                            }
                            break;
                    }
                
            });

    }
});

// plugin constructor
$.inlineEdit = function( elem, options ) {

    // deep extend
    this.options = $.extend( true, {}, $.inlineEdit.defaults, options );

    // the original element
    this.element = $( elem );

    // go!
    //this.init();
}

$.inlineEdit.initialised = function( elem ) {
    var init = $( elem ).data( 'init' + namespace );
    return init !== undefined && init !== null ? true : false;
}

// plugin extensions
$.extend( $.inlineEdit, {

    // plugin defaults
    defaults: {
        hover: 'ui-state-hover',
        value: '',
        save: '',
        buttonText: 'Save',
        placeholder: 'Click to edit',
        control: 'input'
    },

    // plugin prototypes
    prototype: {

        // initialisation
        init: function() {
            
            // set initialise flag
            this.element.data( 'init' + namespace, true );
            
            // initialise value
            this.initValue();

            // mutate
            this.mutate();
            
            // save widget data
            this.element.data( 'widget' + namespace, this );

        },

        initValue: function() {
            this.value( $.trim( this.element.text() ) || this.options.value );
            
            if ( !this.value() ) {
                this.element.html( $( this.placeholderHtml() ) );
            } else if ( this.options.value ) {
                this.element.html( this.options.value );
            }
        },
        
        mutate: function() {
            var self = this;

            return self
                .element
                    .html( self.mutatedHtml( self.value() ) )
                    .find( 'button' )
                        .bind( 'click', function( event ) {
                            self.save( self.element, event );
                        })
                    .end()
                    .find( self.options.control )
                        .bind( 'focusout', function( event ) {
                            self.change( self.element, event );
                        })
                    .focus();
        },
        
        value: function( newValue ) {
            if ( arguments.length ) {
                this.element.data( 'value' + namespace, $( '.' + placeholderClass, this ).length ? '' : newValue && newValue.replace( /\n/g,"<br />" ) );
            }
            return this.element.data( 'value' + namespace );
        },

        mutatedHtml: function( value ) {
            return this.controls[ this.options.control ].call( this, value );
        },

        placeholderHtml: function() {
            return '<span class="'+ placeholderClass +'">'+ this.options.placeholder +'</span>';
        },

        buttonHtml: function( options ) {
            var o = $.extend({}, {
                before: ' ',
                buttons: '<button>'+ this.options.buttonText +'</button>',
                after: ''
            }, options);
            
            return o.before + o.buttons + o.after;
        },
        
        save: function( elem, event ) {
            var hash = {
                value: this.element.find( this.options.control ).val()
            };

            if ( ( $.isFunction( this.options.save ) && this.options.save.call( this, event, hash ) ) !== false || !this.options.save ) {
                this.value( hash.value );
            }
        },
        
        change: function( elem, event ) {
            
            var self = this;
            
            if ( this.timer ) {
                window.clearTimeout( this.timer );
            }

            this.timer = window.setTimeout( function() {
                self.element.html( self.value() || self.placeholderHtml() );
                self.element.removeClass( self.options.hover );
            }, 200 );

        },

        controls: {
            textarea: function( value ) {
                return '<textarea>'+ value.replace(/<br\s?\/?>/g,"\n") +'</textarea>' + this.buttonHtml( { before: '<br />' } );
            },
            input: function( value ) {
                return '<input type="text" value="'+ value +'">' + this.buttonHtml();
            }
        },

        changeState: function( event ) {
            $( event.target )[event.type === 'mouseover' ? 'addClass':'removeClass']( this.options.hover );
        }

    }
});

})(jQuery);