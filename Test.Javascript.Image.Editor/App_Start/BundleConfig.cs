using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Optimization;

namespace Test.Javascript.Image.Editor
{
    public class NonOrderingBundleOrderer : IBundleOrderer
    {
        public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
        {
            return files;
        }
    }

    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;

            var jQueryAndPlugins = new ScriptBundle("~/bundles/jquery")
                .Include("~/Scripts/jquery/jquery-{version}.js")
                .Include("~/Scripts/jquery/jquery.fontselect.js");
            jQueryAndPlugins.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(jQueryAndPlugins);

            bundles.Add(new ScriptBundle(
                "~/bundles/underscore")
                .Include("~/Scripts/underscore/underscore.js"));

            var knockoutAndPlugins = new ScriptBundle("~/bundles/knockout")
                .Include("~/Scripts/knockout/knockout-{version}.js")
                .Include("~/Scripts/knockout/knockout.extenders.numeric.js")
                .Include("~/Scripts/knockout/knockout.mapping-latest.debug.js")
                .Include("~/Scripts/knockout/knockout.momento.js");
            knockoutAndPlugins.Orderer = new NonOrderingBundleOrderer();
            bundles.Add(knockoutAndPlugins);

            bundles.Add(new ScriptBundle(
                "~/bundles/webfontloader",
                "https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js")
                .Include("~/Scripts/webfont.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/jscolor")
                .Include("~/Scripts/jscolor.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/fabricjs",
                "http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.5.0/fabric.min.js")
                .Include("~/Scripts/fabric/fabric.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/pixijs")
                .Include(
                    "~/Scripts/pixi/pixi.js"));

            //bundles.Add(new ScriptBundle(
            //    "~/bundles/dropzone")
            //    .Include("~/Scripts/dropzone/dropzone.js"));

            //bundles.Add(new StyleBundle(
            //    "~/Content/dropzonescss")
            //    .Include(
            //        "~/Scripts/dropzone/css/basic.css",
            //        "~/Scripts/dropzone/css/dropzone.css"));

            bundles.Add(new ScriptBundle(
                "~/bundles/bootstrap")
                .Include("~/Scripts/bootstrap/bootstrap.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/pollyfill")
                .Include(
                    "~/Scripts/polyfill/modernizr-*",
                    "~/Scripts/polyfill/respond.js"));

            bundles.Add(new StyleBundle(
                "~/Content/css")
                .Include(
                    "~/Content/bootstrap.css",
                    "~/Content/site.css",
                    "~/Content/fontselect/fontselect.css"));
        }
    }
}
