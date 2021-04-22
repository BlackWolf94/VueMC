# Models and Collections for Vue.js

<p align="center" style='margin-top: 250px'>
  <a href="https://github.com/BlackWolf94/VueMC" target="_blank">
    <img width="180" src="docs/mc.png" alt="logo">
  </a>
</p>

## Introduction

The relationship between data, component states, and the actions that affect them is a fundamental and unavoidable
layer to manage when building a component or application. Vue does not provide a way to structure and encapsulate data,
so most projects use plain objects and implement their own patterns to communicate with the server.
This is perfectly fine for small applications, but can quickly become a lot to manage when the size of
your project and team increases.

This library takes care of this for you, providing a single point of entry and a consistent API:

- Communicating with the server to `fetch`, `save`, and `delete`.
- Managing model states like empty, `active` and `saved`.
- Managing component states like `loading`, `saving`, and `deleting`.

When we started to use Vue more extensively, we noticed that every team had a slightly different
way of doing this, so we decided to develop a standard solution that is flexible enough to accommodate
most use cases in a consistent way, while preserving reactivity and testability.

The basic concept is that of a `Model` and a `Collection` of models.
Data and component state is managed automatically, and CRUD is built-in. A classic example would be a to-do list,
where each task would be a model and the list of tasks would be a collection.

____
## Installation

Add the `@zidadindimon/vue-mc` package to your package dependencies:

```bash
npm i @zidadindimon/vue-mc
```

[DOCS](https://blackwolf94.github.io/VueMC/)

[Example](https://bitbucket.org/master-form/vuebase/src/4c8c13e047e6094795f07f3096b8f90e535f0dcf/src/mc/?at=release%2Fmodel-collection)

