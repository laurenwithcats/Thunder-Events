import { DEFAULT_TIMES } from '../../constants'
import { getDateInfo, mapString, roundMinutes, runMethod } from '../../utilities'
import { getCellData } from './componentUtils'

const renderByTime = ({ events, times, locations, sortBy }) => {

  const { days, interval } = times || DEFAULT_TIMES

  // this keeps colspans from previous iterations in memory
  // so we can avoid adding extra table cells.
  const spanState = {}

  return mapString(Object.keys(days), day => {
    const _times = days[day]
    const now = roundMinutes(Date.now(), interval)
    const allTimes = sortBy === 'now'
      ? _times.filter(({ date }) => date >= now)
      : sortBy === 'nowOnly'
        ? _times.filter(({ date }) => date === now)
        : _times
    const times = allTimes.length ? allTimes : [{ date: now, timeString: getDateInfo(now).time }]
    return /* html */`
      <div class="pg-table-wrapper">
        <table class="pg-table">
          <thead class="pg-header">
            <tr class="pg-row">
              <td class="pg-cell-wrapper pg-cell-wrapper--corner" onclick="${runMethod('toggleSortDialog', true)}">
                <div class="pg-cell pg-cell--corner"><i class="pg-more-icon"></i> ${day}</div>
              </td>
              ${mapString(times, ({ timeString }) => /* html */`
                <th class="pg-cell-wrapper pg-cell-wrapper--column-header pg-cell-wrapper--column-header-active">
                  <div class="pg-cell pg-cell--column-header pg-cell--column-header-active">${timeString}</div>
                </th>
              `)}
            </tr>
          </thead>
          <tbody class="pg-body">
            ${mapString(locations, _location => /* html */`
              <tr class="pg-row">
                <th class="pg-cell-wrapper pg-cell-wrapper--row-header">
                  <div class="pg-cell pg-cell--row-header">${_location}</div>
                </th>
                ${mapString(times, ({ date }) => {
                  const { eventName, cellType, span, blank, event } = getCellData({ events, spanState, date, interval, _location })
                  if (blank) return '' // blank if cell from previous row occupies this space
                  return /* html */`
                    <td class="pg-cell-wrapper pg-cell-wrapper--${cellType} pg-cell-wrapper--${cellType}-active" colspan="${span}" ${event ? `onclick="${runMethod('openEventDialog', event)}"` : ''}>
                      <div class="pg-cell pg-cell--${cellType} pg-cell--${cellType}-active">${eventName}</div>
                    </td>
                  `
                })}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `
  })
}

export default renderByTime