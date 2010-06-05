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
        return this.each( function() {

            new $.inlineEdit( this, options );

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
    this.init();
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

            this.initValue();

            var self = this;

            self.element.bind( 'click', function( event ) {
                var $this = $( event.target );

                if ( $this.is( 'button' ) ) {

                    self.save( $this, event );

                } else if ( $this.is( self.element[0].tagName ) || $this.hasClass( placeholderClass ) ) {

                    self.element
                        .html( self.mutatedHtml( self.value() ) )
                        .find( self.options.control )
                            .bind( 'blur', function() {
                                self.change( $this, event );
                            })
                            .focus();

                }
            })
            .bind('mouseenter mouseleave', function( event ) {

                $( this )[event.type === 'mouseenter' ? 'addClass':'removeClass']( self.options.hover );

            });

        },

        initValue: function() {
            this.value( $.trim( this.element.text() ) || this.options.value );
            
            if ( !this.value() ) {
                this.element.html( $( this.placeholderHtml() ) );
            } else if ( this.options.value ) {
                this.element.html( this.options.value );
            }
        },
        
        value: function( newValue ) {
            if ( arguments.length ) {
                this.element.data( 'value' + namespace, $( '.' + placeholderClass, this ).length ? '' : newValue.replace( /\n/g,"<br />" ) );
            }
            return this.element.data( 'value' + namespace );
        },

        mutatedHtml: function( value ) {
            if ( this.options.control ) {
                switch ( this.options.control ) {
                    case 'textarea':
                        return '<textarea>'+ value.replace(/<br\s?\/?>/g,"\n") +'</textarea>' + '<br /><button>'+ this.options.buttonText +'</button>';
                }
            }

            return '<input type="text" value="'+ value +'">' + ' <button>'+ this.options.buttonText +'</button>';
        },

        placeholderHtml: function() {
            return '<span class="'+ placeholderClass +'">'+ this.options.placeholder +'</span>';
        },
        
        save: function( elem, event ) {
            var hash = {
                value: $input = elem.siblings( this.options.control ).val()
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

        }

    }
});

})(jQuery);