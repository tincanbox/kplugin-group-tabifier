import '../../asset/scss/desktop.scss';

(function(k, factory) {
  'use strict';

  factory(new Kluginn.default());

})(kintone, function(p){

  var K = p;
  var $ = K.$;
  var C = {
    wrapper_id: 'kplugin-group-tabifier-wrapper',
    wrapper: null,
    attr_data_index: 'data-kp-group-tabifier-index',
    selector: {
      link_group_class: 'kplugin-group-tabifier-group-anchor',
      target_wrapper: '#record-gaia',
      target_cont: '.gaia-argoui-app-toolbar',
      target_list: '.control-group-gaia',
      target_label: '.group-label-gaia',
      exclude_offset: 0
    }
  };

  var S = {
    info: {}
  };

  function DestInfo($el, i){
    var o = this;
    $el.attr(C.attr_data_index, i);
    o.$el = $el;
    o.index = i;
    o.position = $el.offset().top;
    o.name = $el.find(C.selector.target_label).text();
  }

  var p = K.init();

  K.$k.events.on('app.record.detail.show', function(e){
    if(!S.inited){
      p.then(init);
      S.inited = true;
    }
  });

  function init(){
    C.wrapper = $('<section>');

    update_info();
    build({
      position: 'after'
    });

    $(window).on('scroll', function(){
      var scrtp = $(document).scrollTop();
      var btwn = null;
      var p = 0;

      for(var k in S.info){
        var d = S.info[k];
        var tpx = calc_border(d);
        if(tpx <= scrtp && tpx > p){
          btwn = d;
          p = tpx;
        }
      }

      update_anchor_class(btwn);
    });
  }

  function build(o){
    var t = $(C.selector.target_cont);
    var w = C.wrapper;

    w.attr('id', C.wrapper_id);
    w.addClass('BSTRP');
    w.on('click', '.' + C.selector.link_group_class, action);

    // add Top
    w.append(build_anchor({
      index: -1,
      name: "▲"
    }));

    var data = update_info();
    for(var k in data){
      w.append(build_anchor(data[k]));
    }

    S.built = true;

    t[o.position](w);
    return t;
  }

  function action(ev){
    update_info();
    var $el = $(ev.target);
    var idx = parseInt($el.attr(C.attr_data_index));
    var tpx = 0;
    if(idx == -1){
      tpx = C.wait_scrolltop;
    }else{
      var dst;
      for(var k in S.info){
        var d = S.info[k];
        if(d.index == idx){
          tpx = calc_border(d) + 1;
          break;
        }
      }
    }
    $([document.documentElement, document.body]).animate({
        scrollTop: tpx
    }, 'fast');
  }

  function build_anchor(d){
    var a = $('<a>');
    a.addClass(C.selector.link_group_class);
    a.attr(C.attr_data_index, d.index);
    a.text(d.name);
    return a;
  }

  function calc_border(info){
    return info.position - C.wait_scrolltop + C.offset_keep;
  }

  function update_info(){
    console.log("update info");
    C.wait_scrolltop
      = $('.gaia-argoui-app-show-toolbar').height()
      + $('.gaia-header-toolbar-navigation').height()
      + $('.gaia-argoui-app-toolbar').height()
    ;
    C.offset_keep
      = 0
      + C.wrapper.height()
    ;

    var grp_el_list = $(C.selector.target_list);
    S.info = {};
    grp_el_list.each(function(i, v){
      var o = new DestInfo($(this), i);
      S.info[o.name] = o;
    });
    console.log("C", C);
    console.log("S", S);
    return S.info;
  }

  function update_anchor_class(info){
    $('.' + C.selector.link_group_class).removeClass("kp-gt-viewing");
    if(info){
      find_anchor_by_index(info.index).addClass("kp-gt-viewing");
    }
  }

  function find_anchor_by_index(index){
    return $('.' + C.selector.link_group_class + '[' + C.attr_data_index + '=' + index + ']');
  }

});
