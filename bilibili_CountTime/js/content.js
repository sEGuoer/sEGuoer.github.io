
setTimeout(function () {
        const allTime = document.querySelectorAll(".video-episode-card__info-duration")
        let time = 0
        let needtime = 0
        let selectWhichIsLooking = 0
        allTime.forEach(function (element) {
            let timeGroup = element.textContent.split(':')
            if (selectWhichIsLooking === 1) {
                if (timeGroup.length === 3) {
                    let elementTime = parseInt(timeGroup[0]) * 3600 + parseInt(timeGroup[1]) * 60 + parseInt(timeGroup[2])
                    time = time + elementTime
                    needtime = needtime + elementTime

                } else if (timeGroup.length === 2) {
                    let elementTime = parseInt(timeGroup[0]) * 60 + parseInt(timeGroup[1])
                    needtime = needtime + elementTime
                    time = time + elementTime
                } else if (timeGroup.length === 1) {
                    let elementTime = parseInt(timeGroup[0])
                    time = time + elementTime
                    needtime = needtime + elementTime

                }
            } else if (selectWhichIsLooking === 0) {
                let a = element.parentElement.querySelector(".video-episode-card__info-title .cur-play-icon")
                console.log(a.getAttribute("style"))
                if (a.getAttribute("style") === "display:none;") {
                    if (timeGroup.length === 3) {
                        let elementTime = parseInt(timeGroup[0]) * 3600 + parseInt(timeGroup[1]) * 60 + parseInt(timeGroup[2])
                        time = time + elementTime

                    } else if (timeGroup.length === 2) {
                        let elementTime = parseInt(timeGroup[0]) * 60 + parseInt(timeGroup[1])

                        time = time + elementTime
                    } else if (timeGroup.length === 1) {
                        let elementTime = parseInt(timeGroup[0])
                        time = time + elementTime
                    }
                } else {
                    selectWhichIsLooking = 1
                    if (timeGroup.length === 3) {
                        let elementTime = parseInt(timeGroup[0]) * 3600 + parseInt(timeGroup[1]) * 60 + parseInt(timeGroup[2])
                        time = time + elementTime
                        needtime = needtime + elementTime

                    } else if (timeGroup.length === 2) {
                        let elementTime = parseInt(timeGroup[0]) * 60 + parseInt(timeGroup[1])
                        needtime = needtime + elementTime

                        time = time + elementTime
                    } else if (timeGroup.length === 1) {
                        let elementTime = parseInt(timeGroup[0])
                        time = time + elementTime
                        needtime = needtime + elementTime
                    }
                }
            }
        })
        console.log(time)
        let hour1 = parseInt(time / 3600)
        console.log(hour1)

        let minute1 = parseInt(time % 3600 / 60)
        console.log(minute1)

        let second1 = time % 3600 % 60
        console.log(second1)
        let addContent1 = document.getElementById("viewbox_report")
        addContent1.appendChild(document.createTextNode("看完合集用时" + hour1 + ":" + minute1 + ":" + second1))
        console.log(needtime)
        let hour2 = parseInt(needtime / 3600)
        console.log(hour2)

        let minute2 = parseInt(needtime % 3600 / 60)
        console.log(minute2)

        let second2 = needtime % 3600 % 60
        console.log(second2)
        let addContent2 = document.querySelector(".first-line-left .cur-page")
        addContent2.appendChild(document.createTextNode("看完合集用时" + hour2 + ":" + minute2 + ":" + second2))
    }
    , 5000)


