<?php
/**
 * Plugin Name: Region Select
 * Description: A simple plugin to add a region select field to the website.
 * Version: 2.1.0
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

		// Add a shortcode to display the div element where the React app will be rendered.
		add_shortcode( 'region_select', array( $this, 'region_select_shortcode' ) );

		// Get the region page ID from options.
		$this->region_page_id = get_option( 'region_select_page_id', 0 );
	}

	/**
	 * Check if the region cookie is set - only on initial front page visit
	 *
	 * @since 1.0
	 */
	public function check_region_cookie() {
		if ( is_admin() ) {
			return;
		}

		// Check if we have a region parameter from region selection.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Temporary parameter for region selection flow
		if ( isset( $_GET['region'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Temporary parameter for region selection flow
			$region = sanitize_text_field( wp_unslash( $_GET['region'] ) );

			// Set the cookie server-side to ensure it's properly set.
			setcookie( 'selectedRegion', $region, time() + ( 30 * DAY_IN_SECONDS ), COOKIEPATH, COOKIE_DOMAIN );

			// Redirect to clean URL based on region.
			if ( 'na' === $region ) {
				// For North America, redirect to home page with lang=na to avoid loop.
				wp_safe_redirect( home_url() . '?lang=na' );
			} elseif ( 'uk' === $region ) {
				wp_safe_redirect( 'https://bartongarnet.com/?lang=en' );
			} else {
				wp_safe_redirect( 'https://bartongarnet.com/?lang=' . $region );
			}
			exit;
		}

		// Only redirect to region-select page if no cookie is set.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- URL parameter check for redirect logic, no form processing
		if ( ! isset( $_COOKIE['selectedRegion'] ) && ! is_page( $this->region_page_id ) && ! isset( $_GET['lang'] ) ) {
			wp_safe_redirect( get_permalink( $this->region_page_id ) );
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
					'homeUrl' => home_url(),
				)
			);
		}
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
