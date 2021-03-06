// jquery select 插件
import "./index.css";

(function($) {
    var defaluts = {
        select: "select",
        select_text: "select_text",
        select_ul: "select_ul"
    };
    $.fn.extend({
        select: function(options) {
            var opts = $.extend({}, defaluts, options);
            return this.each(function() {
                var $this = $(this);
                if (
                    $this.data("value") !== undefined &&
                    $this.data("value") !== ""
                ) {
                    $this.val($this.data("value"));
                }
                var _html = [];
                _html.push(
                    '<div class="' +
                        $this.attr("class") +
                        '" id="select_' +
                        ($this.attr("id") || $this.attr("name")) +
                        '">'
                );
                _html.push(
                    '<div class="' +
                        opts.select_text +
                        '">' +
                        $this.find(":selected").text() +
                        "</div>"
                );
                _html.push('<ul class="' + opts.select_ul + '">');
                $this.children("option").each(function() {
                    var option = $(this);
                    if ($this.data("value") == option.val()) {
                        _html.push(
                            '<li class="cur" data-value="' +
                                option.val() +
                                '">' +
                                option.text() +
                                "</li>"
                        );
                    } else {
                        _html.push(
                            '<li data-value="' +
                                option.val() +
                                '">' +
                                option.text() +
                                "</li>"
                        );
                    }
                });
                _html.push("</ul>");
                _html.push(
                    '<div class="arrow-down iconfont icon-arrow-down"><span class="ie-only">&#xe69a;</span></div></div>'
                );
                var select = $(_html.join(""));
                var select_text = select.find("." + opts.select_text);
                var select_ul = select.find("." + opts.select_ul);
                $this.after(select);
                $this.hide();
                var select_arrow = select.find(".arrow-down");
                select.click(function(event) {
                    $(this)
                        .find("." + opts.select_ul)
                        .toggle()
                        .end()
                        .siblings("div." + opts.select)
                        .find("." + opts.select_ul)
                        .hide();
                    select_ul.css("display") === "none"
                        ? select_arrow.removeClass("active")
                        : select_arrow.addClass("active");
                    event.stopPropagation();
                });
                $("body").click(function() {
                    select_ul.hide();
                    select_arrow.removeClass("active");
                });
                select_ul.on("click", "li", function() {
                    var li = $(this);
                    var val = li
                        .addClass("cur")
                        .siblings("li")
                        .removeClass("cur")
                        .end()
                        .data("value")
                        .toString();
                    select_arrow.removeClass("active");
                    if (val !== $this.val()) {
                        select_text.text(li.text());
                        $this.val(val);
                        $this.attr("data-value", val);
                    }
                });
            });
        }
    });
})(jQuery);
