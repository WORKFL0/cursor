import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Disclaimer - Workflo IT Services',
  description: 'Legal disclaimer and terms of use for Workflo IT Services website',
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Website Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Information Accuracy</h2>
              <p>
                While Workflo strives to provide accurate and up-to-date information, 
                we make no representations or warranties of any kind, express or implied, 
                about the completeness, accuracy, reliability, suitability, or availability 
                with respect to the website or the information, products, services, or 
                related graphics contained on the website.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Professional Advice</h2>
              <p>
                The content on this website is for general information and educational 
                purposes only. It should not be construed as professional IT consulting 
                or legal advice. Users should consult with a qualified professional 
                before making any decisions based on the information provided.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">External Links</h2>
              <p>
                Workflo is not responsible for the content of external websites 
                linked from this site. The inclusion of any links does not necessarily 
                imply a recommendation or endorsement of the views expressed within them.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p>
                In no event will Workflo be liable for any loss or damage including 
                without limitation, indirect or consequential loss or damage, or any 
                loss or damage whatsoever arising from loss of data or profits arising 
                out of, or in connection with, the use of this website.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Copyright and Trademarks</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, 
                is the property of Workflo B.V. and protected by Dutch and international 
                copyright laws. Reproduction without explicit permission is prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Privacy</h2>
              <p>
                Your use of this website is also governed by our Privacy Policy. 
                Please review our data collection and usage practices.
              </p>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Last Updated: August 2025 | Workflo B.V. | KvK: [Chamber of Commerce Number]
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}