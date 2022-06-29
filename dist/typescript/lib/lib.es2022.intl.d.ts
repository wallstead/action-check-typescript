/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */



/// <reference no-default-lib="true"/>


declare namespace Intl {

    /**
     * An object with some or all properties of the `Intl.Segmenter` constructor `options` parameter.
     *
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#parameters)
     */
    interface SegmenterOptions {
        /** The locale matching algorithm to use. For information about this option, see [Intl page](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation). */
        localeMatcher?: "best fit" | "lookup" | undefined;
        /** The type of input to be split */
        granularity?: "grapheme" | "word" | "sentence" | undefined;
    }

    interface Segmenter {
        /**
         * Returns `Segments` object containing the segments of the input string, using the segmenter's locale and granularity.
         *
         * @param input - The text to be segmented as a `string`.
         *
         * @returns A new iterable Segments object containing the segments of the input string, using the segmenter's locale and granularity.
         */
        segment(input: string): Segments;
        resolvedOptions(): ResolvedSegmenterOptions;
    }

    interface ResolvedSegmenterOptions {
        locale: string;
        granularity: "grapheme" | "word" | "sentence";
    }

    interface Segments {
        /**
         * Returns an object describing the segment in the original string that includes the code unit at a specified index.
         *
         * @param codeUnitIndex - A number specifying the index of the code unit in the original input string. If the value is omitted, it defaults to `0`.
         */
        containing(codeUnitIndex?: number): SegmentData;

        /** Returns an iterator to iterate over the segments. */
        [Symbol.iterator](): IterableIterator<SegmentData>;
    }

    interface SegmentData {
        /** A string containing the segment extracted from the original input string. */
        segment: string;
        /** The code unit index in the original input string at which the segment begins. */
        index: number;
        /** The complete input string that was segmented. */
        input: string;
        /**
         * A boolean value only if granularity is "word"; otherwise, undefined.
         * If granularity is "word", then isWordLike is true when the segment is word-like (i.e., consists of letters/numbers/ideographs/etc.); otherwise, false.
         */
        isWordLike?: boolean;
    }

    const Segmenter: {
        prototype: Segmenter;

        /**
         * Creates a new `Intl.Segmenter` object.
         *
         * @param locales - A string with a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such strings.
         *  For the general form and interpretation of the `locales` argument,
         *  see the [`Intl` page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation).
         *
         * @param options - An [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#parameters)
         *  with some or all options of `SegmenterOptions`.
         *
         * @returns [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segments) object.
         *
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter).
         */
        new(locales?: BCP47LanguageTag | BCP47LanguageTag[], options?: SegmenterOptions): Segmenter;

        /**
         * Returns an array containing those of the provided locales that are supported without having to fall back to the runtime's default locale.
         *
         * @param locales - A string with a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such strings.
         *  For the general form and interpretation of the `locales` argument,
         *  see the [`Intl` page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation).
         *
         * @param options An [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/supportedLocalesOf#parameters).
         *  with some or all possible options.
         *
         * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/supportedLocalesOf)
         */
        supportedLocalesOf(locales: BCP47LanguageTag | BCP47LanguageTag[], options?: Pick<SegmenterOptions, "localeMatcher">): BCP47LanguageTag[];
    };
}
