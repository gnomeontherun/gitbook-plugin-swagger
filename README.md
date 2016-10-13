# Gitbook Swagger Plugin

This plugin will render out a Swagger definition file into a page.

### How to use

First you'll need to add to your **book.json**.

    {
      "plugins": ["swagger"]
    }

Then you'll need to add the following snippet into a book page, and it will replace it with the rendered version.

    <swagger>swagger.json</swagger>

The file between the tags can be either a local file or a url. It must resolve to a swagger JSON file.

# To Do

* [ ] Get stylings to work better by default
* [ ] Polish some of the layouts
* [ ] Add UI collapsing and niceness
* [ ] Determine if can/should support 'Try it now' features
* [ ] Add test suites

# License

MIT. See [License](./LICENSE)