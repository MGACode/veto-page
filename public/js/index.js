var counter = 0
var counterMax = 6
var team1 = 'Team 1'
var team2 = 'Team 2'
var statusTypes = ['Ban', 'Ban', 'Pick', 'Pick']
var pickedMaps = []
var randomNumber = Math.floor(Math.random() * 3) // Used to determine map choice
var mapElement = find('.map-name')

infoLogic()

$('.map-panel').click(function() {
  var elem = $(this)
  if (counter < counterMax && !elem.attr('active')) {
    var title = elem.find('.team-name')
    var mapName = elem.find('.map-name')
    var statusElem = elem.find('.status')
    var status = statusTypes[counter % 4]

    if (counter % 2 === 0) {
      elem.addClass('team-1')
      title.html(team1)
      mapName.html(mapName.text())
    } else {
      elem.addClass('team-2')
      title.html(team2)
      mapName.html(mapName.text())
    }

    if (status === 'Pick') {
      elem.attr('picked', true)
      pickedMaps.push(mapName.text())
      statusElem.html(status).css({
        color: '#73f461'
      })
    } else if (status !== 'Pick') {
      elem.attr('picked', false)
      statusElem.html(status).css({
        color: '#f49c61'
      })
    }

    elem.attr('active', true)
    elem.css({
      borderWidth: 5
    })
    elem.removeClass('default')
    statusElem.html(status)
    counter++
    infoLogic()

  }
})

function infoLogic() {

  if (counter === 0 && counter !== counterMax) {
    //$('.next-turn').html(team1 + '\'s' + ' turn to ' + statusTypes[counter % 4])
  } else if (counter % 2 === 0 && counter !== counterMax) {
    $('.next-turn').html(team1 + '\'s' + ' turn to ' + statusTypes[counter % 4])
  } else if (counter % 2 !== 0 && counter !== counterMax) {
    $('.next-turn').html(team2 + '\'s' + ' turn to ' + statusTypes[counter % 4])
  } else if (counter === counterMax) {
    $('.next-turn').html('Played map will be: ' + pickedMaps[randomNumber])
  }

}


$('.input-teams').click(function() {
  $('.ui.modal').modal('show')
})

$('.ok.button').click(function() {
  team1 = $('input[name="team1"]').val()
  team2 = $('input[name="team2"]').val()
})
