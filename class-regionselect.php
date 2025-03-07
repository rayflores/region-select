<?php
/**
 * Plugin Name: Region Select
 * Description: A simple plugin to add a region select field to the website.
 * Version: 1.3
 * Author: Ray Flores
 * Author URI: https://rayflores.com
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: region-select
 *
 * @package RegionSelect
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The main plugin class
 *
 * @since 1.0
 * @package RegionSelect
 * @category Class
 */
class RegionSelect {

	/**
	 * The constructor
	 *
	 * @since 1.0
	 */
	public function __construct() {
		add_action( 'template_redirect', array( $this, 'check_region_cookie' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_filter( 'page_template', array( $this, 'region_select_template' ) );
		add_filter( 'theme_page_templates', array( $this, 'add_region_select_template' ) );

		// Add a shortcode to display the div element where the React app will be rendered.
		add_shortcode( 'region_select', array( $this, 'region_select_shortcode' ) );
		add_filter( 'avada_after_header_wrapper', array( $this, 'region_select_place_shortcode_before_content' ) );
	}

	/**
	 * Add the region select template to the theme
	 *
	 * @param array $templates The list of templates.
	 * @return array
	 * @since 1.0
	 */
	public function add_region_select_template( $templates ) {
		$templates['region-select-template.php'] = 'Region Select';
		return $templates;
	}

	/**
	 * Load the region select template
	 *
	 * @param string $template The template file.
	 * @return string
	 * @since 1.0
	 */
	public function region_select_template( $template ) {
		if ( get_page_template_slug() === 'region-select-template.php' ) {
			$new_template = plugin_dir_path( __FILE__ ) . 'region-select-template.php';
			if ( '' !== $new_template ) {
				return $new_template;
			}
		}
		return $template;
	}

	/**
	 * Check if the region cookie is set
	 *
	 * @since 1.0
	 */
	public function check_region_cookie() {
		if ( is_admin() ) {
			return;
		}

		// add 'region-select' query arg.
		$url = add_query_arg( 'region-select', 'true', home_url() );

		if ( isset( $_GET['lang'] ) ) {
			return;
		}

		if ( ! isset( $_COOKIE['selectedRegion'] ) && ! is_front_page() ) {
			// No cookie set and not on the home page.

			header( 'Location: ' . $url );
		} elseif ( ! isset( $_COOKIE['selectedRegion'] ) && is_front_page() ) {
			// No cookie set and on the home page.

			// add 'region-select' query arg.
			header( 'Location: ' . $url );

		} elseif ( isset( $_COOKIE['selectedRegion'] ) && is_front_page() ) {
			header( 'Location: ' . home_url() . '/?lang=' . sanitize_text_field( wp_unslash( $_COOKIE['selectedRegion'] ) ) );
		} else {
			return;
		}
	}

	/**
	 * Enqueue the React root element and scripts
	 *
	 * @since 1.0
	 */
	public function enqueue_scripts() {
		if ( is_front_page() && ! isset( $_GET['lang'] ) ) {
			wp_enqueue_script( 'react' );
			wp_enqueue_script( 'react-dom' );

			$inc = require 'build/index.asset.php';

			// Enqueue our plugin's React app.
			wp_enqueue_script(
				'region-select-app',
				plugins_url( 'build/index.js', __FILE__ ),
				$inc['dependencies'],
				$inc['version'],
				true
			);

			// Enqueue the CSS file.
			wp_enqueue_style(
				'region-select-css',
				plugins_url( 'build/index.css', __FILE__ ),
				array(),
				filemtime( plugin_dir_path( __FILE__ ) . 'build/index.css' )
			);

			// Pass WordPress data to React.
			wp_localize_script(
				'region-select-app',
				'wpData',
				array(
					'restUrl' => get_rest_url(),
					'nonce'   => wp_create_nonce( 'wp_rest' ),
					'homeUrl' => home_url(),
				)
			);
		}
	}

	/**
	 * Register the REST API routes
	 *
	 * @since 1.0
	 */
	public function register_routes() {
		register_rest_route(
			'region-select/v1',
			'/set-region',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'set_region_cookie' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Set the region cookie
	 *
	 * @param WP_REST_Request $request The REST request object.
	 * @since 1.0
	 */
	public function set_region_cookie( $request ) {
		$region = $request->get_param( 'region' );
		setcookie( 'selectedRegion', $region, time() + ( 30 * DAY_IN_SECONDS ), COOKIEPATH, COOKIE_DOMAIN );
		return new WP_REST_Response( array( 'success' => true ), 200 );
	}

	/**
	 * Active the plugin
	 *
	 * @since 1.0
	 */
	public function activate() {
		// Check home page for region-select shortcode.
		$home_page = get_page( get_option( 'page_on_front' ) );
		if ( has_shortcode( $home_page->post_content, 'region_select' ) ) {
			return;
		} else {
			// add shortcode via avada hooks

		}
	}

	/**
	 * Filter for avada theme before body content
	 */
	public function region_select_place_shortcode_before_content() {
		echo do_shortcode( '[region_select]' );
	}
	/**
	 * Display the region select shortcode
	 *
	 * @return string
	 * @since 1.0
	 */
	public function region_select_shortcode() {
		return '<div id="region-select-root" class="block"></div>';
	}
}



// Initialize the plugin.
$region_select = new RegionSelect();
// register_activation_hook( __FILE__, array( $region_select, 'activate' ) );
