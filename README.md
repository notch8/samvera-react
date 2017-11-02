# Using React in a Rails 5 Samvera app

### Review starting place
  - Blacklight catalog views copied from gem

### Goals
  - React based autocomplete (type ahead) for search input

## Use React with Rails
### install webpacker and webpacker-react
```
$ echo "gem 'webpacker', '~> 3.0'" >> Gemfile
$ echo "gem 'webpacker-react', '~> 0.3.2' >> Gemfile

THEN

$ bundle && bundle exec rails webpacker:install webpacker:install:react
```

### install webpacker-react gem
```

$ ./bin/yarn add webpacker-react
```


### Copy over view for editing
```
$ cp /Users/mclark/.rvm/gems/ruby-2.3.0/gems/blacklight-6.7.3/app/views/catalog app/views/
```

### Create a Search Component
#### app/javascript/components/search/index.js
```javascript
import React from 'react'
import {Component} from 'react'

export default class Search extends Component {
  render() {
    return(<h1>Hello from Search Component</h1>)
  }
}
```

### Create a new Search pack
#### app/javascript/packs/search.js
```javascript
import Search from 'components/search'
import WebpackerReact from 'webpacker-react'

WebpackerReact.setup({Search})
```

### Add pack and component to _search_form.html.erb
```html
<!-- Add the pack to the document head -->
<% content_for :head do %>
  <%= javascript_pack_tag 'search' %>
<% end %>
  
<%= form_tag search_action_url, method: :get, class: 'search-query-form clearfix navbar-form', role: 'search' do %>
  <%= render_hash_as_hidden_fields(search_state.params_for_search.except(:q, :search_field, :qt, :page, :utf8)) %>
  <div class="input-group">
    <% if search_fields.length > 1 %>
      <span class="input-group-addon for-search-field">
        <label for="search_field" class="sr-only"><%= t('blacklight.search.form.search_field.label') %></label>
        <%= select_tag(:search_field, options_for_select(search_fields, h(params[:search_field])), title: t('blacklight.search.form.search_field.title'), id: "search_field", class: "search_field") %>
      </span>
    <% elsif search_fields.length == 1 %>
      <%= hidden_field_tag :search_field, search_fields.first.last %>
    <% end %>

    <label for="q" class="sr-only"><%= t('blacklight.search.form.search.label') %></label>

    <!-- Replace Text element ith our React component -->
    <%= react_component('Search', {query: params[:q], placeholder: t('blacklight.search.form.search.placeholder')}) %>

    <span class="input-group-btn">
      <button type="submit" class="btn btn-primary search-btn" id="search">
        <span class="submit-search-text"><%= t('blacklight.search.form.submit') %></span>
        <span class="glyphicon glyphicon-search"></span>
      </button>
    </span>
  </div>
<% end %>
````

## Autocomplete

### install the react-typeahead module
```
$ yarn add react-autocomplete
```

### Flesh out the Search component with autocomplete

#### app/javascript/components/search/index.js
```javascript
import React from 'react'
import {Component} from 'react'

import Autocomplete from 'react-autocomplete'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: props.value,
      autocompleteOptions: [
        "John",
        "Paul",
        "George",
        "Ringo"
      ]
    }
  }

  render() {
    return(
      <Autocomplete
        inputProps = {{
          name: "q",
          id: "q",
          type: 'text',
          placeholder: this.props.placeholder,
          className: "search_q q form-control"
        }}
        items={this.state.autocompleteOptions}
        value={this.state.value}
        onChange={(e) => this.setState({value: e.target.value})}
        onSelect={(val) => this.setState({value: val})}
        getItemValue={(item) => item}
        renderItem={(item, isHighlighted) =>
          <div
            key={item}
            style={{ background: isHighlighted ? 'lightgray' : 'white' }}
          >
            {item}
          </div>
          }
        />
      )
    }
}
```
