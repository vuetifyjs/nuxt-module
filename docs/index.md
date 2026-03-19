---
layout: home
sidebar: false

title: Vuetify Nuxt Module

hero:
  name: Vuetify + Nuxt
  text: Production UI without boilerplate
  tagline: Build faster with zero-config defaults, SSR-aware setup and fully customizable Vuetify runtime.
  image:
    src: /logo.svg
    alt: Vuetify Nuxt Module
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuetifyjs/nuxt-module/

features:
  - icon: ⚡
    title: Zero-Config
    details: Sensible defaults for most Nuxt + Vuetify projects, ready in minutes
  - icon: 🛠️
    title: Runtime Extensibility
    details: Customize module behavior with Nuxt runtime and module hooks
    link: /guide/advanced/runtime-hooks
    linkText: Explore Hooks
  - icon: 💥
    title: SSR + Client Hints
    details: Smart SSR detection and HTTP Client Hints support for better UX
    link: /guide/features/ssr
    linkText: Learn SSR
  - icon: 🎨
    title: Flexible Styling
    details: Configure Vuetify SASS variables and styling pipeline to match your design system
    link: /guide/styling/sass
    linkText: Style Guide
  - icon: 🧩
    title: Icon Strategy
    details: Pure CSS icons, icon fonts, SVG icons and multiple icon sets support
    link: /guide/features/icons/unocss-preset-icons
    linkText: Icons Setup
  - icon: 🌍
    title: i18n + Date Support
    details: Integrates with @nuxtjs/i18n and @date-io adapters for global-ready apps
    link: /guide/features/i18n
    linkText: Internationalization
---

<div class="home-new-app">
  <div class="home-new-app__content">
    <p class="home-new-app__title">New App?</p>
    <p class="home-new-app__subtitle">Scaffold with a single command.</p>
  </div>
  <div class="home-new-app__terminal">
    <HomeHeroCopy command="pnpm create vuetify --platform=nuxt" />
  </div>
</div>

<section class="home-benefits">
  <div class="home-benefits__head">
    <p class="home-benefits__kicker">Ship fast, stay in control</p>
    <h2>Everything you need to run Vuetify on Nuxt at scale.</h2>
  </div>
  <div class="home-benefits__grid">
    <a href="/guide/advanced/layers-and-hooks" class="home-benefits__item">
      <p class="home-benefits__title">Works with Nuxt layers</p>
      <p>Share design systems and register custom configuration per layer or module.</p>
      <span>See layer workflow →</span>
    </a>
    <a href="/guide/features/globals/" class="home-benefits__item">
      <p class="home-benefits__title">DX-first defaults</p>
      <p>Auto-imported composables, optional directives, lab components and icon pipelines.</p>
      <span>Browse feature docs →</span>
    </a>
  </div>
</section>
