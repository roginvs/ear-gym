const originalFunctions: { [name: string]: Function } = {};
for (const name of ["log", "info", "warn", "error"]) {
    originalFunctions[name] = (console as any)[name];
    (console as any)[name] = function() {
        var mainArguments = [].slice.call(arguments, 0);
        var now = new Date();
        mainArguments.unshift(name);
        mainArguments.unshift(now.toISOString());
        const str =
            new Date() +
            " " +
            mainArguments.map((x: any) => {
                try {
                    if (x instanceof Error) {
                        return `${x.name} ${x.message} ${x.stack}`;
                    } else if (typeof x === "object") {
                        if (Object.keys(x).length < 10) {
                            return (
                                "Object: " +
                                Object.keys(x)
                                    .map(xx => `${xx}=${x[xx]}`)
                                    .join(", ")
                            );
                        } else {
                            return x;
                        }
                    } else {
                        return x;
                    }
                } catch (e) {
                    return x;
                }
            });
        originalFunctions[name].apply(console, mainArguments);

        const div = document.createElement("div");
        div.innerHTML = str;
        const monkey = document.getElementById("monkeyLogs");
        if (monkey) {
            monkey.appendChild(div);
        }
    };
}

window.onerror = function(msg, url, linenumber, linepos, error) {
    console.error(
        'JSERROR "' +
            msg +
            '" in ' +
            url +
            " on line: " +
            linenumber +
            ":" +
            linepos +
            (error
                ? " " + error.message + " " + error.name + " " + error.stack
                : "")
    );
    return true;
};
