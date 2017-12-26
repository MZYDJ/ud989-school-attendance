let attendance = {};

const octopus = {
    init: function() {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');

            var nameColumns = $('tbody .name-col');

            nameColumns.each(function() {
                var name = this.innerText;
                attendance[name] = [];

                for (var i = 0; i <= 11; i++) {
                    attendance[name].push(octopus.getRandom());
                }
            });

            localStorage.attendance = JSON.stringify(attendance);
        } else {
            attendance = JSON.parse(localStorage.attendance);
        }
        tbodyView.init();
    },

    getRandom: function() {
        return (Math.random() >= 0.5);
    },

    getModel: function() {
        return attendance;
    },

    save: function() {
        localStorage.attendance = JSON.stringify(attendance);
    },

    getMissed: function(student) {
        let missed = 0;
        attendance[student].forEach((i) => {
            if (i == false) {
                missed++;
            };
        });
        return missed;
    },

    choseMissed: function() {
        const studentRow = $(this).parent().parent('tr'),
            studentName = $(studentRow).children('.name-col');
        const name = studentName.text();
        attendance[name][$(this).parent().prevAll('.attend-col').length] = $(this).prop('checked');

        tbodyView.countMissing();
        octopus.save();
    }
}

const tbodyView = {
    init: function() {
        $.each(octopus.getModel(), function(name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function(i) {
                $(this).prop('checked', days[i]);
            });
        });

        $('tbody input').on('click', octopus.choseMissed);
        tbodyView.countMissing();
    },

    countMissing: function() {
        $('tbody .missed-col').each(function() {
            var studentRow = $(this).parent('tr'),
                studentName = $(studentRow).children('.name-col');
            this.innerText = octopus.getMissed($(studentName).text());
        });
    }
}
octopus.init();
