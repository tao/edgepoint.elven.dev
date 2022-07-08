export function _reduceSurveyDetails (surveyDetails) {
  let columns = surveyDetails.columns
  let rows = surveyDetails.rows[0] ?? []
  let data = []
  let response = {}

  columns.map(el => {
    data[el.id] = {
      heading: el.heading,
      id: el.id,
    }
  })

  if (rows.columns) {
    rows.columns.map(el => {
      data[el.headerColumnId].value = el.value
    })
  }

  Object.values(data).map(el => {
    response[el.heading.slugify()] = el.value
  })

  return response
}

export function _reduceTableDetails (table) {
  let rows = table.rows ?? []
  let response = []

  rows.map(row => {
    let temp = {}

    row.columns.forEach(el => {
      let tableTitle = table.columns.find(col => el.headerColumnId === col.id).heading.slugify()
      temp[tableTitle] = el.value
    })

    response.push(temp)
  })

  return response
}

export function _reduceAllDetails (details) {
  let data = {}
  let response = {}

  details.map(el => {
    let obj = el

    switch (el.kind) {
      case 'category': {
        if (el.items && el.items.length === 0 && el.selectedItems.length !== 0) {
          obj = el.selectedItems[0].value
          break;
        }

        if (el.categoryType === 'dropdown') {
          if (el.items && el.items.length > 0 && el.selectedItems.length !== 0) {
            obj = el.selectedItems[0].value
            break;
          }

          if (el.items && el.items.length > 0 && el.selectedItems.length === 0) {
            obj = undefined
          }
        }
      }
      case 'table': {
        obj = _reduceTableDetails(el)
        break;
      }
      case 'yesNoCheckbox': {
        obj = el.checked
        break;
      }
      case 'multiLineInput': {
        obj = el.content
        break;
      }
    }

    data[el.description.slugify()] = obj
  })

  return data
}

export function _removeUnansweredDuplicates(data) {
  return data.filter(el => {
    switch (el.kind) {
      case 'table': {
        if (el.rows.length > 0) return el;
        else return false;
      }
      default: {
        return el;
      }
    }
  })
}
