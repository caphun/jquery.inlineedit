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

    $.fn.inlineEdit = function(options) {

        options = $.extend({
            hover: 'ui-state-hover',
            value: '',
            save: '',
            buttonText: 'Save',
            placeholder: 'Click to edit',
            control: 'input'
        }, options);

        return this.each(function() {
            $.inlineEdit(this, options);
        });
    }

    $.inlineEdit = function(obj, options) {
        var self = $(obj),
            placeholderHtml = '<span class="inlineEdit-placeholder">'+ options.placeholder +'</span>',
            control = options.control;

        self.value = function(newValue) {
            if (arguments.length) {
                self.data('value', $('.inlineEdit-placeholder', self).length ? '' : newValue.replace(/\n/g,"<br />"));
            }
            return self.data('value');
        }

        self.value($.trim(self.text()) || options.value);

        self.bind('click', function(event) {
            var $this = $(event.target);

            if ($this.is('button')) {
                var hash = {
                    value: $input = $this.siblings(control).val()
                };

                if (($.isFunction(options.save) && options.save.call(self, event, hash)) !== false || !options.save) {
                    self.value(hash.value);
                }

            } else if ($this.is(self[0].tagName) || $this.hasClass('inlineEdit-placeholder')) {
                self
                    .html( mutatedHtml(self.value()) )
                    .find(control)
                        .bind('blur', function() {
                            if (self.timer) {
                                window.clearTimeout(self.timer);
                            }
                            self.timer = window.setTimeout(function() {
                                self.html(self.value() || placeholderHtml);
                                self.removeClass(options.hover);
                            }, 200);
                        })
                        .focus();
            }
        })
        .hover(
            function(){
                $(this).addClass(options.hover);
            },
            function(){
                $(this).removeClass(options.hover);
            }
        );

        if (!self.value()) {
            self.html($(placeholderHtml));
        } else if (options.value) {
            self.html(options.value);
        }

        var mutatedHtml = function(value) {
            if (options.control) {
                switch (options.control) {
                    case 'textarea':
                        return '<textarea>'+ value.replace(/<br\s?\/?>/g,"\n") +'</textarea>' + '<br /><button>'+ options.buttonText +'</button>';
                }
            }
            return '<input type="text" value="'+ value +'">' + ' <button>'+ options.buttonText +'</button>';
        }
    }

})(jQuery);