<?php
/**
 * Plugin Name: Region Select
 * Description: A simple plugin to add a region select field to the website.
 * Version: 1.6.2
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
	 * Region select page ID
	 *
	 * @var int
	 */
	private $region_page_id;

	/**
	 * The constructor
	 *
	 * @since 1.0
	 */
	public function __construct() {

		add_action( 'template_redirect', array( $this, 'check_region_cookie' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );

		// Add a shortcode to display the div element where the React app will be rendered.
		add_shortcode( 'region_select', array( $this, 'region_select_shortcode' ) );

		// Get the region page ID from options.
		$this->region_page_id = get_option( 'region_select_page_id', 0 );
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

		// Don't redirect if we're already on the region select page.
		if ( is_page( $this->region_page_id ) ) {
			return;
		}

		// Only check on front page.
		if ( ! is_front_page() ) {
			return;
		}

		// If lang param is present, don't redirect - user is already on a language-specific page.
		if ( isset( $_GET['lang'] ) ) {
			return;
		}

		// Check if region cookie exists.
		if ( isset( $_COOKIE['selectedRegion'] ) ) {
			$region = sanitize_text_field( wp_unslash( $_COOKIE['selectedRegion'] ) );

			if ( 'na' === $region ) {
				// For North America, stay on home page without any redirects.
				return;
			} else {
				// For other regions, redirect to home page with lang param.
				wp_redirect( home_url() . '/?lang=' . $region );
				exit;
			}
		}

		// Only redirect to region-select page if no cookie is set.
		if ( $this->region_page_id ) {
			wp_redirect( get_permalink( $this->region_page_id ) );
			exit;
		}
	}

	/**
	 * Enqueue the React root element and scripts
	 *
	 * @since 1.0
	 */
	public function enqueue_scripts() {
		if ( is_page( $this->region_page_id ) ) {
			wp_enqueue_script( 'react' );
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
		// Let JavaScript handle cookie setting to avoid conflicts
		// setcookie( 'selectedRegion', $region, time() + ( 30 * DAY_IN_SECONDS ), COOKIEPATH, COOKIE_DOMAIN );
		return new WP_REST_Response(
			array(
				'success' => true,
				'region'  => $region,
			),
			200
		);
	}

	/**
	 * Activate the plugin - create the region select page
	 *
	 * @since 1.0
	 */
	public function activate() {
		// Check if page already exists.
		$existing_page_id = get_option( 'region_select_page_id', 0 );
		if ( $existing_page_id && get_post( $existing_page_id ) ) {
			return;
		}

		// Create the region select page.
		$page_data = array(
			'post_title'   => 'Select Your Region',
			'post_content' => '[region_select]',
			'post_status'  => 'publish',
			'post_type'    => 'page',
			'post_slug'    => 'region-select',
		);

		$page_id = wp_insert_post( $page_data );

		if ( $page_id && ! is_wp_error( $page_id ) ) {
			update_option( 'region_select_page_id', $page_id );
			$this->region_page_id = $page_id;
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
register_activation_hook( __FILE__, array( $region_select, 'activate' ) );
