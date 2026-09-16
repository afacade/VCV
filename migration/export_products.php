<?php
// Export Vinh Cuong Vina WooCommerce catalog to JSON (products, variations, images, pages).
error_reporting(0);
ini_set('display_errors', '0');
define('WP_USE_THEMES', false);
require '/Applications/XAMPP/xamppfiles/htdocs/wordpress/wp-load.php';

if (!function_exists('wc_get_products')) { fwrite(STDERR, "WooCommerce not loaded\n"); exit(1); }

function img_arr($id){
  if(!$id) return null;
  $path = get_attached_file($id);
  $url  = wp_get_attachment_url($id);
  return ['id'=>(int)$id, 'path'=>$path, 'url'=>$url, 'alt'=>get_post_meta($id,'_wp_attachment_image_alt',true)];
}

$out = ['products'=>[], 'pages'=>[], 'posts'=>[], 'menus'=>[]];

$products = wc_get_products(['limit'=>-1, 'status'=>'publish', 'orderby'=>'menu_order', 'order'=>'ASC']);
foreach($products as $p){
  $cats = [];
  foreach($p->get_category_ids() as $cid){ $t=get_term($cid,'product_cat'); if($t && !is_wp_error($t)) $cats[]=['name'=>$t->name,'slug'=>$t->slug,'parent'=>$t->parent]; }
  $gallery = [];
  foreach($p->get_gallery_image_ids() as $gid){ $gallery[] = img_arr($gid); }

  $vars = [];
  if($p->is_type('variable')){
    foreach($p->get_available_variations() as $v){
      $vo = wc_get_product($v['variation_id']);
      $vars[] = [
        'id'=>$v['variation_id'],
        'attributes'=>$v['attributes'],
        'price'=>$vo? $vo->get_price():null,
        'regular'=>$vo? $vo->get_regular_price():null,
        'sale'=>$vo? $vo->get_sale_price():null,
        'sku'=>$vo? $vo->get_sku():'',
        'image'=>isset($v['image']['url'])? $v['image']['url']:null,
      ];
    }
  }

  $attrs = [];
  foreach($p->get_attributes() as $an=>$a){
    if(is_object($a)){
      $opts = $a->get_options();
      // taxonomy attrs store term ids
      if($a->is_taxonomy()){
        $terms = wc_get_product_terms($p->get_id(), $a->get_name(), ['fields'=>'names']);
        $opts = $terms;
      }
      $attrs[] = ['name'=>wc_attribute_label($a->get_name()), 'options'=>$opts, 'variation'=>$a->get_variation()];
    }
  }

  $out['products'][] = [
    'id'=>$p->get_id(),
    'name'=>$p->get_name(),
    'slug'=>$p->get_slug(),
    'type'=>$p->get_type(),
    'sku'=>$p->get_sku(),
    'price'=>$p->get_price(),
    'regular'=>$p->get_regular_price(),
    'sale'=>$p->get_sale_price(),
    'price_min'=>$p->is_type('variable')? $p->get_variation_price('min'):$p->get_price(),
    'price_max'=>$p->is_type('variable')? $p->get_variation_price('max'):$p->get_price(),
    'short'=>trim(wp_strip_all_tags($p->get_short_description())),
    'description'=>$p->get_description(),
    'categories'=>$cats,
    'featured'=>img_arr($p->get_image_id()),
    'gallery'=>$gallery,
    'attributes'=>$attrs,
    'variations'=>$vars,
    'menu_order'=>$p->get_menu_order(),
    'featured_flag'=>$p->get_featured(),
  ];
}

// Product category thumbnails (used as category icons)
$out['category_icons'] = [];
$terms = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false]);
if (!is_wp_error($terms)) {
  foreach ($terms as $tr) {
    $tid = get_term_meta($tr->term_id, 'thumbnail_id', true);
    if ($tid) $out['category_icons'][$tr->slug] = img_arr($tid);
  }
}

// Pages (info + policy)
$page_ids = [2494,2505,2508,6363,6374,6376,6378,6380,6384,2183,2181];
foreach($page_ids as $pid){
  $pg = get_post($pid);
  if($pg && $pg->post_status==='publish'){
    $out['pages'][] = ['id'=>$pid,'title'=>$pg->post_title,'slug'=>$pg->post_name,
      'content_raw'=>$pg->post_content, 'content_text'=>trim(wp_strip_all_tags(apply_filters('the_content',$pg->post_content)))];
  }
}

// Blog posts
$posts = get_posts(['numberposts'=>-1,'post_status'=>'publish']);
foreach($posts as $bp){
  $out['posts'][] = ['id'=>$bp->ID,'title'=>$bp->post_title,'slug'=>$bp->post_name,'date'=>$bp->post_date,
    'excerpt'=>trim(wp_strip_all_tags($bp->post_excerpt?:wp_trim_words($bp->post_content,40))),
    'content_text'=>trim(wp_strip_all_tags(apply_filters('the_content',$bp->post_content))),
    'featured'=>img_arr(get_post_thumbnail_id($bp->ID))];
}

$dest = $argv[1] ?? 'php://stdout';
file_put_contents($dest, json_encode($out, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
fwrite(STDERR, "products=".count($out['products'])." pages=".count($out['pages'])." posts=".count($out['posts'])."\n");
