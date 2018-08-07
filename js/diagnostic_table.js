$(function()
{
    var color_td     = $(".color_td.active");
    var cell_values  = new Array();
    var templates_td = $(".result");

    $(".rt_checkbox").each(function()
    {
        $(this).attr("checked", false);
    });

    $.post
    (
        "/diagnostic_table/data",
        {'YUPE_TOKEN':'0186f13755101fd2d5df5ca2874eb28446aa5a83'},
        function(result)
        {
        	var systems = result.data;
            color_td.each(function()
            {
                var cell = parseInt($(this).attr("cell"));
                var msg = systems[cell-1].name;

                $(this).bt(msg, {
                    positions: 'top',
                    fill: 'white'
                });
            })

            $("#result_button").click(function()
            {
                templates_td.html("");

                for (cell in cell_values)
                {
                    var s_tpl      = $("#s_tpl").html();
                    var cell_value = cell_values[cell];
                    var system     = systems[cell-1];

                    for (system_value in system.values)
                    {
                        eval("var res = " + cell_value + system.values[system_value] + ";");

                        if (res)
                        {
                            s_tpl = s_tpl.replace("{SYSTEM_VALUE}", system_value);
                            s_tpl = s_tpl.replace("{RU_VALUE}", ru_system_values[system_value]);

                            //console.log(system.name);
                            //console.log("cell_value: " + cell_value);
                            //console.log("var res = " + cell_value + system.values[system_value] + ";");
                            //console.log(res);
                            break;
                        }
                    }

                    var product_link = "&nbsp; <a href='/catalog?category_id=bad&category%5B%5D=" + system.category + "' class='products_link' target='_blank'>продукция</a>";

                    s_tpl = s_tpl.replace("{NAME}", system.name);
                    s_tpl = s_tpl.replace("{TEXT}", system.description);
                    s_tpl = s_tpl.replace("{ICON}", system.icon);
                    s_tpl = s_tpl.replace("{SYSTEM_ID}", system.id);
                    s_tpl = s_tpl.replace("{PRODUCT_LINK}", product_link);

                    templates_td.append(s_tpl);
                }

                initProductsLinks();

                location.href="#result";
            });
        },
        "json"
    );

    for (var i = 1; i <= 9; i++)
    {
        cell_values[i] = 0;
    }

    function rating(mark, very_good_l, good_f, good_l, adequately_f, adequately_l, i){
        var classD = '.border_div' + i + ' .square_div';
        if(mark >= 0 && mark <= very_good_l){
            $(classD).addClass('good');
            return('<span style="color:#898f82" class="text-result">Очень хорошо</span>')
        } else if (mark >= good_f && mark <= good_l){
            $(classD).addClass('good');
            return('<span style="color:#898f82" class="text-result">хорошо</span>')
        } else if(mark >= adequately_f && mark <= adequately_l){
            $(classD).addClass('satisfactorily');
            return('<span style="color:#cdbc64" class="text-result">удовлетворительно</span>')
        } else{
            $(classD).addClass('nosatisfactorily');
            return('<span style="color:#eb8872" class="text-result">неудовлетворительно</span>')
        }
    }

    function return_text(id, result){
        div_id = '.border_div' + id + ' .result ';
        $(div_id).append(result);

    }


    $("#result_button").click(function(){
        $('.wrapper-result').addClass('active');
        templates_td.html("");
        for(var i = 1; i < 10; i++){
            var id = '#cell_' + i;
            var text = $(id).text();
            text = text.replace(/\s/g, '');


            if(i == 1){
                res = (rating(text, 2, 3, 4, 5, 9, i));
            } else if (i == 2){
                res = (rating(text, 2, 3, 4, 5, 9, i));
            } else if (i == 3){
                res = (rating(text, 2, 3, 3, 4, 7, i));
            } else if (i == 4){
                res = (rating(text, 2, 3, 5, 6, 10, i));
            } else if (i == 5){
                res = (rating(text, 2, 3, 4, 5, 7, i));
            } else if (i == 6){
                res = (rating(text, 0, 1, 1, 2, 4, i));
            } else if (i == 7){
                res = (rating(text, 0, 1, 1, 2, 4, i));
            } else if (i == 8){
                res = (rating(text, 3, 4, 4, 5, 10, i));
            } else if (i == 9){
                res = (rating(text, 1, 2, 3, 4, 7, i));
            }

            return_text(i, res);
        }
    });

    $(".rt_checkbox").click(function()//,.label_td
    {
        templates_td.html("");
        $('.wrapper-result').removeClass('active');
        var checkbox = $(this);
        var checked = checkbox.is(':checked');

        checkbox.parents("tr:eq(0)").find(".color_td").each(function()
        {
            var bgcolor = $(this).attr("bgcolor");
            var cell    = $(this).attr("cell");
            if (isNaN(cell_values[cell]))
            {
                cell_values[cell] = 0;
            }

            if (bgcolor == "white")
            {
                if (checked)
                {
                    cell_values[cell]++;
                    $(this).addClass("selected");
                }
                else
                {
                    cell_values[cell]--;
                    $(this).removeClass("selected");
                }
            }
        });

        calculateResult();
    });


    color_td.mouseover(function()
    {
        clearColorTdBorders();
        var cur_cell = $(this).attr("cell");
        var lines_count = 48;
        var index = 0;
        color_td.each(function()
        {
            var cell = $(this).attr("cell");

            if (cell == cur_cell)
            {
                if (index == 0)
                {
                    $(this).css("border-top", "1px solid gray");
                }

                if (index == (lines_count - 1))
                {
                    $(this).css("border-bottom", "1px solid gray");
                }

                $(this).css("border-left", "1px solid gray");
                $(this).css("border-right", "1px solid gray");

                index++;
            }
        });
    });


    color_td.mouseout(function()
    {
        $(".bt-wrapper").remove();
        clearColorTdBorders();
    });


    function clearColorTdBorders()
    {
        color_td.each(function()
        {
        	$(this).attr("style", null);
        });
    }


    function calculateResult()
    {
        for (var index in cell_values)
        {
            $("#cell_" + index).html(cell_values[index]);
        }
    }
});

var ru_system_values = {
    very_good : "<span style='color:#557F03'>Очень хорошо</span>",
    good      : "<span style='color:#475C1D'>Хорошо</span>",
    normal    : "<span style='color:#5C98E2'>Удовлетворительно</span>",
    bad       : "<span style='color:#E93310'>Неудовлетворительно</span>"
}


function initProductsLinks()
{
    var system_products_div = $(".system_products_div");
}