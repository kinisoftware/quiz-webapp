import com.google.gson.Gson
import spark.kotlin.Http
import spark.kotlin.ignite

fun main(args: Array<String>) {

    val http: Http = ignite()

    http.options(path = "/*") {
        val accessControlRequestHeaders = request.headers("Access-Control-Request-Headers")
        if (accessControlRequestHeaders != null) {
            response.header("Access-Control-Allow-Headers", accessControlRequestHeaders)
        }

        val accessControlRequestMethod = request.headers("Access-Control-Request-Method")
        if (accessControlRequestMethod != null) {
            response.header("Access-Control-Allow-Methods", accessControlRequestMethod)
        }
        "OK"
    }

    http.before(path = "/*") { response.header("Access-Control-Allow-Origin", "*") }

    http.get(path = "/question") {
        response.type("application/json")
        val answerOptions = listOf(
                AnswerOption("ao1", "Option 1"),
                AnswerOption("ao2", "Option 2"),
                AnswerOption("ao3", "Option 3")
        )
        JsonTransformer().render(listOf(Question(id = "1", text = "Question 1", answerOptions = answerOptions)))
    }

    http.post(path = "/question", accepts = "application/json") {
        val body = Gson().fromJson(request.body(), SelectedAnswer::class.java)
        print(body)
        response.type("application/json")
        response.status(200)
        "{}"
    }
}