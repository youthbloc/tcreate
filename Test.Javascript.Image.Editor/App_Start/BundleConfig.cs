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
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/jquery.fontselect.js");

            jQueryAndPlugins.Orderer = new NonOrderingBundleOrderer();

            bundles.Add(jQueryAndPlugins);

            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle(
                "~/bundles/modernizr")
                .Include("~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle(
                "~/bundles/bootstrap")
                .Include("~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/webfontloader",
                "https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js")
                .Include("~/Scripts/webfont.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/underscore")
                .Include("~/Scripts/underscore.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/fabricjs",
                "http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.5.0/fabric.min.js")
                .Include("~/Scripts/fabric.js"));

            bundles.Add(new ScriptBundle(
                "~/bundles/pixijs")
                .Include(
                    "~/Scripts/pixi.js"));

            //bundles.Add(new ScriptBundle(
            //    "~/bundles/")
            //    .Include(
            //        "~/Scripts/"));

            bundles.Add(new StyleBundle(
                "~/Content/css")
                .Include(
                    "~/Content/bootstrap.css",
                    "~/Content/site.css",
                    "~/Content/fontselect/fontselect.css"));
        }
    }
}
