import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import LogoWater from "@site/static/img/logos/LogoWater.svg";

const FramaworksList = [
	{
		Svg: require('@site/static/img/demo-apps/Angular-1920-2560.svg').default,
		repository: "",
		demo: "",
	},
	{
		Svg: require('@site/static/img/demo-apps/React-1920-2560.svg').default,
		repository: "",
		demo: "",
	},
	{
		Svg: require('@site/static/img/demo-apps/Vue-1920-2560.svg').default,
		repository: "",
		demo: "",
	},
	{
		Svg: require('@site/static/img/demo-apps/Svelte-1920-2560.svg').default,
		repository: "",
		demo: "",
	},
];

function Logo( { colorMode: string }) {
	return (
		<LogoWater className={styles.logoMain} />
	);
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const { colorMode } = useColorMode();

  return (<header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}ssss</p>

      </div>
    </header>
  );
}

function HomepageContent() {
	const {siteConfig} = useDocusaurusContext();
	const { colorMode } = useColorMode();

	return (
		<header className={clsx('hero hero--primary', styles.heroBanner)}>
			<div className={clsx('container', styles.container)}>

				<Logo colorMode={colorMode}/>
				<Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
					<span className={styles.heroTitle__UI5}>SAP Geomap</span>
				</Heading>

				<p className={clsx('hero__subtitle', styles.heroSubtitle)}>
					<span className={styles.hero__subtitle__part1}><b>Web Component</b></span> for displaying geographical data!
				</p>
				<div className={styles.buttons}>
					<Link
						className="button button--primary button--lg button--getting-started"
						to="/documentation/getting-started/first-steps">
						Get Started
					</Link>

					<Link
						className={clsx("button button--secondary button--lg button--getting-started", styles.buttonSecondary)}
						to="/components/Geomap">
						Components
					</Link>
				</div>
			</div>
		</header>
	);
}

const FeatureList = [
	{
		title: 'Easy to Use',
		src: require('@site/static/img/features/light/Frame.png').default,
		srcDark: require('@site/static/img/features/dark/Frame.png').default,
		description: (
			<>
				Based on web standards - just HTML!
				Future-proof.
				Easy to add to your project.
			</>
		),
		cssClass: "feature__image_frame"
	},
	{
		title: 'Lightweight',
		src: require('@site/static/img/features/light/Hand.png').default,
		srcDark: require('@site/static/img/features/dark/Hand.png').default,
		description: (
			<>
				Tiny - come with a minimal footprint.
				Modular - take only the parts you need.
				Fast - built with performance in mind. Uses WebGL.
			</>
		),
	},
	{
		title: 'Enterprise Ready',
		src: require('@site/static/img/features/light/Buildings.png').default,
		srcDark: require('@site/static/img/features/dark/Buildings.png').default,
		description: (
			<>
				Implements latest SAP Design language.
				Feature-rich.
				Secure, accessible, themeable, i18n-ready.
			</>
		),
	},
];

function Feature({ title, src, srcDark, description, cssClass }) {
	const { colorMode } = useColorMode();
	const light = colorMode === "light";

	return (
		<div className={clsx('feature', styles.feature)}>
			{light ? <img className={clsx(`feature__image  ${cssClass}`, styles.feature__image)} src={src} /> : <img className={clsx(`feature__image  ${cssClass}`, styles.feature__image)} src={srcDark} /> }
			<h2 className={clsx('feature__title', styles.feature__title)}>{title}</h2>
			<p className={clsx('feature__desc', styles.feature__desc)}>{description}</p>
		</div>
	);
}

function HomepageFeatures() {
	return (
		<section className={clsx('features', styles.features)}>
			<div className={clsx('features__container', styles.features__container)}>
				{FeatureList.map((props, idx) => (
					<Feature key={idx} {...props} />
				))}
			</div>
		</section>
	);
}

const Framework = ({ Svg, repository, demo }) => {
	return (
		<div className={clsx('demo_apps__framework', styles.demo_apps__framework)}>
			<Svg className={clsx('demo_apps__logo', styles.demo_apps__logo) }/>
			{repository ? <a href={repository} className="demo-apps__link" target="_blank">Explore the Code</a> : ""}
			{demo ? <a href={demo} className="demo-apps__link" target="_blank">Run the Demo App</a> : ""}
		</div>
	);
}

function HomepageDemoApps() {
	return (
		<article className={clsx('demo_apps', styles.demo_apps)}>
			<div className={clsx('demo_apps__heading', styles.demo_apps__heading)}>
				<h2 className={clsx('demo_apps__title', styles.demo_apps__title)}>Use the web framework of your choice</h2>
				<p className={clsx('demo_apps__desc', styles.demo_apps__desc)}> UI5 Web Componnents are framework agnostic, working seamlessly with all popular frameworks,
					including Angular, React, Vue, Svelte, etc.</p>
			</div>
			<div className={clsx('demo_apps__frameworks', styles.demo_apps__frameworks)}>
				{FramaworksList.map((props, idx) => (
					<Framework key={idx} {...props} />
				))}
			</div>
		</article>
	);
}

export default function Home() {
	const {siteConfig} = useDocusaurusContext();
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />">
			<main>
				<HomepageContent/>
				<HomepageFeatures/>
				<HomepageDemoApps/>
			</main>
		</Layout>
	);
}
