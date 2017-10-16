import React from 'react'
import {Component} from 'react'

import Autocomplete from 'react-autocomplete'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: props.value,
      autocompleteOptions: [
        'John',
        'Paul',
        'George',
        'Ringo']
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
