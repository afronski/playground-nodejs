(defproject hello-world "0.1.0-SNAPSHOT"
  :description "Hello World for Node.js in ClojureScript."

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2505"]]

  :node-dependencies [[source-map-support "0.2.8"]]

  :plugins [[lein-cljsbuild "1.0.4-SNAPSHOT"]
            [lein-npm "0.4.0"]]

  :source-paths ["src"]
  :notify-command ["node" "run.js"]

  :cljsbuild {
    :builds [{:id "hello-world"
              :source-paths ["src"]
              :compiler {
                :output-to "out/hello_world.js"
                :output-dir "out"
                :target :nodejs
                :optimizations :none
                :source-map true}}]})
