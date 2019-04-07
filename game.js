var a = 0
document.getElementById('button').onclick = Click
function Click() {
  document.getElementById('button').innerHTML = a
  a = a + 1
  for (var i = 0; i < a; i++){
    var li = document.createElement("LI");
    var textnode = document.createTextNode("Cica");
    li.appendChild(textnode)
    document.getElementById("myList").appendChild(li);
  }
}

function takesNothing() {
  return "nothing"
}
