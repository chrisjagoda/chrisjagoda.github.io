
var selector = document.getElementById('selector');
var educationSelector = document.getElementById('educationSelector');
var workSelector = document.getElementById('workSelector');
var projectsSelector = document.getElementById('projectsSelector');
var education = document.getElementById('education');
var work = document.getElementById('work');
var projects = document.getElementById('projects');
var scrollArea = document.getElementById("scrollArea");
var selected;

scrollArea.addEventListener('scroll', function(e) {
    if (scrollArea.scrollTop > projects.offsetTop - 100 ||
        scrollArea.scrollTop >= scrollArea.scrollHeight - scrollArea.clientHeight - 1) {
        select("projects");
    }
    else if (scrollArea.scrollTop > work.offsetTop - 100) {
        select("work");
    }
    else {
        select("education");
    }
});

function select(target) {
    if (selected != target) {
        resetSelection();
        selected = target;
        if (target == "education") {
            educationSelector.classList.add("selected");
            selector.style.marginTop = "-162px";
        }
        else if (target == "work") {
            workSelector.classList.add("selected");
            selector.style.marginTop = "-108px";
        }
        else {
            projectsSelector.classList.add("selected");
            selector.style.marginTop = "-54px";
        }
    }
}

function resetSelection() {
    educationSelector.classList.remove("selected");
    workSelector.classList.remove("selected");
    projectsSelector.classList.remove("selected");
}

function scrollToTarget(target) {
    return function() {
        target.scrollIntoView({behavior:'smooth', block:'start'});
        select(target.id);
    }
}

var scrollToEducation = scrollToTarget(education);
var scrollToWork = scrollToTarget(work);
var scrollToProjects = scrollToTarget(projects);