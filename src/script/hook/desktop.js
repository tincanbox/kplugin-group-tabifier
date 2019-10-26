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
      target_cont: null,
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
    find_wrapper().remove();
    C.selector.target_cont = '.gaia-argoui-app-show-toolbar';
    p.then(init);
    return e;
  });

  K.$k.events.on('app.record.edit.show', function(e){
    find_wrapper().remove();
    C.selector.target_cont = '.gaia-argoui-app-edit-buttons-contents';
    p.then(init);
    return e;
  });
  K.$k.events.on('app.record.create.show', function(e){
    find_wrapper().remove();
    C.selector.target_cont = '.gaia-argoui-app-edit-form';
    p.then(init);
    return e;
  });

  function find_wrapper(){
    return $('#' + C.wrapper_id);
  }

  function is_available(){
    return find_wrapper().length > 0;
  }


  function init(){
    C.wrapper = $('<section>');

    update_info();
    build({
      position: 'append'
    });

    $(document).on('click', C.selector.target_list, function(e){
      update_info();
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
    var wi = $('<div class="inner">');

    w.attr('id', C.wrapper_id);
    w.addClass('BSTRP');
    w.on('click', '.' + C.selector.link_group_class, action);


    // add Top
    wi.append(build_anchor({
      index: -1,
      name: "▲"
    }));

    var data = update_info();
    for(var k in data){
      wi.append(build_anchor(data[k]));
    }

    w.append(wi);
    t[o.position](w);
    return t;
  }

  function action(ev){
    update_info();
    var $el = $(ev.target);
    var idx = parseInt($el.attr(C.attr_data_index));
    var tpx = 0;
    if(idx == -1){
      tpx = calc_border();
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
    if(info){
      return info.position - C.wait_scrolltop + C.offset_keep;
    }else{
      return C.initial_offset - C.wait_scrolltop + C.offset_keep;
    }
  }

  function fetch_height(sel){
    if(sel instanceof Array){
      return sel.reduce(function(m, s){
        var h = fetch_height(s);
        //console.log(s, $(s).get(0), h);
        return m + h;
      }, 0);
    }else{
      var $el = $(sel);
      if($el.length){
        return $el.height();
      }else{
        return 0;
      }
    }
  }

  function update_info(){
    C.initial_offset = $(C.selector.target_wrapper).offset().top + 24;

    C.wait_scrolltop
      = fetch_height([
        // common
        '.gaia-header-toolbar-navigation',
        '.gaia-argoui-app-titlebar',
        '.gaia-argoui-app-infobar-breadcrumb-iconlist',
      ]) + 80;

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
    //console.log("C", C);
    //console.log("S", S);
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
