###
Task due date
  - displays due date
  - allows for changing it
###

{Button} = require('react-bootstrap')

{React, rclass, rtypes}  = require('../smc-react')

{Calendar, Icon, Space, TimeAgo} = require('../r_misc')

exports.DueDate = rclass
    propTypes :
        actions  : rtypes.object
        task_id  : rtypes.string.isRequired
        due_date : rtypes.number
        editing  : rtypes.bool

    shouldComponentUpdate: (next) ->
        return @props.due_date != next.due_date or \
               @props.task_id  != next.task_id or \
               @props.editing  != next.editing

    toggle_edit: ->
        if @props.editing
            @props.actions.stop_editing_due_date(@props.task_id)
        else
            @props.actions.edit_due_date(@props.task_id)

    set_due_date: (date) ->
        @props.actions.set_due_date(@props.task_id, date)

    render_calendar: ->
        if not @props.editing
            return
        if @props.due_date
            value = new Date(@props.due_date)
        else
            value = new Date()
        <div style={border:'1px solid lightgrey', borderRadius:'4px', margin:'5px', width:'250px', boxShadow:'0 6px 12px rgba(0,0,0,.175)'}>
            <Calendar
                value     = {value}
                on_change = {(date) => @set_due_date(date - 0)}
            />
            <div style={textAlign:'right', margin:'2px'}>
                <Button onClick={@toggle_edit}>
                    Close
                </Button>
            </div>
        </div>

    render_remove_due_date: ->
        if not @props.due_date
            return
        <span>
            <Space />
            <Icon
                name    = 'times'
                onClick = {=> @set_due_date(null); @props.actions.stop_editing_due_date(@props.task_id)}
            />
        </span>

    render_due_date: ->
        if @props.due_date
            elt = <TimeAgo date = {new Date(@props.due_date)} />
        else
            elt = <span>none</span>
        <span onClick={@toggle_edit}>
            {elt}
        </span>

    render: ->
        if not @props.actions?  # read only
            return @render_due_date()
        else
            <div style={cursor:'pointer'}>
                {@render_due_date()}
                {@render_remove_due_date()}
                {@render_calendar()}
            </div>
