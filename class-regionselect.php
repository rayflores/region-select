<?php
/**
 * Plugin Name: Region Select
 * Description: A simple plugin to add a region select field to the website.
 * Version: 1.0
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
		if ( ! isset( $_COOKIE['selectedRegion'] ) && ! is_home() ) {

			// add 'region-select' query arg.
			$url = str_replace( '=true', '', add_query_arg( 'region-select', 'true', home_url() ) );

			if ( ! isset( $_COOKIE['selectedRegion'] ) && is_home() ) {

				if ( isset( $_GET['region-select'] ) ) {
					return;
				} else {
					header( 'Location: ' . home_url( '?region-select' ) );
				}
			}
		} elseif ( isset( $_COOKIE['selectedRegion'] ) && is_home() ) {
			// Redirect to the selected region website with switch case.
			$this->redirect_to_selected_region();

			header( 'Location: ' . home_url( $_COOKIE['selectedRegion'] ) );
		}
	}

	/**
	 * Redirect to the selected region website
	 *
	 * @since 1.0
	 */
	public function redirect_to_selected_region() {
		$selected_region = isset( $_COOKIE['selectedRegion'] ) ? wp_unslash( sanitize_text_field( wp_unslash( $_COOKIE['selectedRegion'] ) ) ) : '';

		switch ( $selected_region ) {
			case 'us':
				wp_safe_redirect( 'Location: https://bartongarnet.com/?translate=us' );
				break;
			case 'it':
				wp_safe_redirect( 'Location: https://bartongarnet.com/?translate=it' );
				break;
			case 'fr':
				wp_safe_redirect( 'Location: https://bartongarnet.com/?translate=fr' );
				break;
			case 'es':
				wp_safe_redirect( 'Location: https://bartongarnet.com/?translate=es' );
				break;
			case 'de':
				wp_safe_redirect( 'Location: https://bartongarnet.com/?translate=de' );
				break;
			case 'uk':
				wp_safe_redirect( 'Location: https://bartongarnet.com/?translate=uk' );
				break;
			default:
				header( 'Location: ' . home_url() );
				break;
		}
	}

	/**
	 * Enqueue the React root element and scripts
	 *
	 * @since 1.0
	 */
	public function enqueue_scripts() {
		if ( is_page( 'region-select' ) ) {
			wp_enqueue_script( 'react' );
			wp_enqueue_script( 'react-dom' );

			// Enqueue our plugin's React app.
			wp_enqueue_script(
				'region-select-app',
				plugins_url( 'build/index.js', __FILE__ ),
				array( 'react', 'react-dom' ),
				'1.0',
				true
			);

			// Enqueue the CSS file.
			wp_enqueue_style(
				'region-select-css',
				plugins_url( 'build/index.css', __FILE__ ),
				array(),
				'1.0'
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
		// Create the region select page if it doesn't exist.
		if ( null === get_page_by_path( 'region-select' ) ) {
			wp_insert_post(
				array(
					'post_title'    => 'Select Your Region',
					'post_name'     => 'region-select',
					'post_status'   => 'publish',
					'post_type'     => 'page',
					'page_template' => 'region-select-template.php',
				)
			);
		}
	}

	// Add a shortcode to display the div element where the React app will be rendered.
	public function region_select_shortcode() {
		return '<div id="region-select-root"></div>';
	}
}



// Initialize the plugin.
$region_select = new RegionSelect();
register_activation_hook( __FILE__, array( $region_select, 'activate' ) );
