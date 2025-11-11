<?php
/**
 * Plugin Name: Region Select
 * Description: A simple plugin to add a region select field to the website.
 * Version: 2.4.0
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
		// Add noindex to region select page.
		add_action( 'wp_head', array( $this, 'add_noindex_to_region_page' ) );

		add_action( 'template_redirect', array( $this, 'check_region_cookie' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		// Enqueue a small site-wide overlay script that shows the region selector on first human visit.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_region_overlay' ) );

		// Add a shortcode to display the div element where the React app will be rendered.
		add_shortcode( 'region_select', array( $this, 'region_select_shortcode' ) );

		// Get the region page ID from options.
		$this->region_page_id = get_option( 'region_select_page_id', 0 );

		// Admin settings: add menu and register settings.
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Register admin menu for plugin settings.
	 */
	public function admin_menu() {
		add_options_page(
			__( 'Region Select', 'region-select' ),
			__( 'Region Select', 'region-select' ),
			'manage_options',
			'region-select',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Register settings for the plugin.
	 */
	public function register_settings() {
			register_setting(
				'region_select_options',
				'region_select_mode',
				array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => 'Select how region selection is presented: overlay or page',
					'default'           => 'overlay',
				)
			);
	}

	/**
	 * Render the admin settings page.
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$mode = get_option( 'region_select_mode', 'overlay' );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Region Select', 'region-select' ); ?></h1>
			<form method="post" action="options.php">
				<?php settings_fields( 'region_select_options' ); ?>
				<?php do_settings_sections( 'region_select_options' ); ?>
				<table class="form-table">
					<tr valign="top">
						<th scope="row"><?php esc_html_e( 'Mode', 'region-select' ); ?></th>
						<td>
							<label>
								<input type="radio" name="region_select_mode" value="overlay" <?php checked( $mode, 'overlay' ); ?> />
								<?php esc_html_e( 'Overlay (show site-wide to first-time visitors)', 'region-select' ); ?>
							</label>
							<br/>
							<label>
								<input type="radio" name="region_select_mode" value="page" <?php checked( $mode, 'page' ); ?> />
								<?php esc_html_e( 'Page (use the region select page and server-side redirect flow)', 'region-select' ); ?>
							</label>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Enqueue a small client-side overlay script site-wide.
	 */
	public function enqueue_region_overlay() {
		// Only enqueue the overlay when admin has selected overlay mode.
		$mode = get_option( 'region_select_mode', 'overlay' );
		if ( 'overlay' !== $mode ) {
			return;
		}
		$build_dir     = plugin_dir_path( __FILE__ ) . 'build/';
		$overlay_asset = $build_dir . 'overlay.asset.php';
		$overlay_js    = $build_dir . 'overlay.js';
		$overlay_css   = $build_dir . 'overlay.css';

		if ( file_exists( $overlay_asset ) ) {
			$inc = require $overlay_asset;

			// Enqueue CSS if present.
			if ( file_exists( $overlay_css ) ) {
				wp_enqueue_style(
					'region-overlay-css',
					plugins_url( 'build/overlay.css', __FILE__ ),
					array(),
					filemtime( $overlay_css )
				);
			}

			// Enqueue the built overlay bundle with its dependencies/version.
			wp_enqueue_script(
				'region-overlay',
				plugins_url( 'build/overlay.js', __FILE__ ),
				isset( $inc['dependencies'] ) ? $inc['dependencies'] : array(),
				isset( $inc['version'] ) ? $inc['version'] : filemtime( $overlay_js ),
				true
			);

			wp_localize_script(
				'region-overlay',
				'regionOverlayData',
				array(
					'homeUrl'      => home_url(),
					'cookieName'   => 'selectedRegion',
					'cookieDays'   => 30,
					'regionPageId' => $this->region_page_id,
					'destinations' => array(
						'na' => home_url() . '?region=na',
						'uk' => 'https://bartongarnet.com/?lang=en',
						'fr' => 'https://bartongarnet.com/?lang=fr',
						'de' => 'https://bartongarnet.com/?lang=de',
						'it' => 'https://bartongarnet.com/?lang=it',
						'es' => 'https://bartongarnet.com/?lang=es',
					),
				)
			);
		} else {
			// Fallback to legacy small script in build/ if present.
			$legacy_js  = $build_dir . 'region-overlay.js';
			$legacy_css = $build_dir . 'region-overlay.css';
			if ( file_exists( $legacy_css ) ) {
				wp_enqueue_style(
					'region-overlay-css',
					plugins_url( 'build/region-overlay.css', __FILE__ ),
					array(),
					filemtime( $legacy_css )
				);
			}
			if ( file_exists( $legacy_js ) ) {
				wp_register_script(
					'region-overlay',
					plugins_url( 'build/region-overlay.js', __FILE__ ),
					array(),
					filemtime( $legacy_js ),
					true
				);
				wp_enqueue_script( 'region-overlay' );
				wp_localize_script(
					'region-overlay',
					'regionOverlayData',
					array(
						'homeUrl'      => home_url(),
						'cookieName'   => 'selectedRegion',
						'cookieDays'   => 30,
						'regionPageId' => $this->region_page_id,
					)
				);
			}
		}
	}
	/**
	 * Add noindex meta tag to region select page
	 */
	public function add_noindex_to_region_page() {
		if ( is_page( $this->region_page_id ) ) {
			echo '<meta name="robots" content="noindex, nofollow" />' . "\n";
		}
	}
	/**
	 * Check if the region cookie is set - only on initial front page visit
	 *
	 * @since 1.0
	 */
	public function check_region_cookie() {
		global $post;

		// Respect admin-selected mode: when overlay mode is enabled, do not perform
		// the server-side redirect to the region select page. The overlay handles
		// prompting humans on the client side. We still process a ?region=na
		// server-side flow when that parameter is present.
		$mode = get_option( 'region_select_mode', 'overlay' );

		if ( is_admin() ) {
			return;
		}

		// Check if page is password protected.
		if ( post_password_required( $post ) ) {
			return;
		}

		// Don't force redirects for bots/crawlers or non-human requests.
		if ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
			$ua = sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) );
			if ( preg_match( '/bot|crawl|spider|slurp|bingbot|googlebot|yandex|baiduspider|duckduckgo|semrush|ahrefs|mj12bot/i', $ua ) ) {
				return;
			}
		}

		// Only consider redirects on normal GET HTML page requests.
		if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'GET' !== $_SERVER['REQUEST_METHOD'] ) {
			return;
		}

		if ( isset( $_SERVER['HTTP_ACCEPT'] ) ) {
			$accept = sanitize_text_field( wp_unslash( $_SERVER['HTTP_ACCEPT'] ) );
			if ( strpos( $accept, 'text/html' ) === false ) {
				return;
			}
		}

		// Check if we have a region parameter from region selection (North America only).
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Temporary parameter for region selection flow
		if ( isset( $_GET['region'] ) && 'na' === $_GET['region'] ) {
			// Set the cookie server-side to ensure it's properly set for North America.
			setcookie( 'selectedRegion', 'na', time() + ( 30 * DAY_IN_SECONDS ), COOKIEPATH, COOKIE_DOMAIN );

			// Redirect to clean home URL with lang parameter.
			wp_safe_redirect( home_url() . '?lang=na' );
			exit;
		}

		// Only redirect to region-select page if no cookie is set and mode is 'page'.
		// In 'overlay' mode we avoid server-side redirects so the client overlay
		// can prompt the visitor instead.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- URL parameter check for redirect logic, no form processing
		if ( 'page' === $mode && ! isset( $_COOKIE['selectedRegion'] ) && ! is_page( $this->region_page_id ) && ! isset( $_GET['lang'] ) ) {
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

			$index_asset = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
			$index_js    = plugin_dir_path( __FILE__ ) . 'build/index.js';

			if ( file_exists( $index_asset ) ) {
				$inc  = require $index_asset;
				$deps = isset( $inc['dependencies'] ) ? $inc['dependencies'] : array();
				$ver  = isset( $inc['version'] ) ? $inc['version'] : filemtime( $index_js );
			} else {
				// Graceful fallback when build artifacts are missing (avoid fatal require()).
				$deps = array();
				$ver  = file_exists( $index_js ) ? filemtime( $index_js ) : false;
			}

			// Enqueue our plugin's React app.
			wp_enqueue_script(
				'region-select-app',
				plugins_url( 'build/index.js', __FILE__ ),
				$deps,
				$ver,
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
